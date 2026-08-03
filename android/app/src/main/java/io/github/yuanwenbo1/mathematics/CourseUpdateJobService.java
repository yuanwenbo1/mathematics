package io.github.yuanwenbo1.mathematics;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.job.JobInfo;
import android.app.job.JobParameters;
import android.app.job.JobScheduler;
import android.app.job.JobService;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class CourseUpdateJobService extends JobService {
    private static final int JOB_ID = 20260803;
    private static final int NOTIFICATION_ID = 1001;
    private static final long CHECK_INTERVAL_MS = 6L * 60L * 60L * 1000L;
    private static final long CHECK_FLEX_MS = 60L * 60L * 1000L;
    private static final String ENDPOINT = "https://yuanwenbo1.github.io/mathematics/app-content-version.json";
    private static final String CHANNEL_ID = "course_updates";
    private static final String PREFERENCES = "course_update_notifications";
    private static final String LAST_NOTIFIED_VERSION = "last_notified_version";
    private static final Pattern VERSION_PATTERN = Pattern.compile("^[0-9a-f]{40}$");
    private static final Pattern BUNDLED_VERSION_PATTERN = Pattern.compile(
            "name=[\\\"']app-content-version[\\\"'][^>]*content=[\\\"']([0-9a-f]{40})[\\\"']",
            Pattern.CASE_INSENSITIVE
    );

    private volatile Thread updateThread;

    public static void schedule(Context context) {
        JobScheduler scheduler = context.getSystemService(JobScheduler.class);
        if (scheduler == null) return;

        JobInfo job = new JobInfo.Builder(JOB_ID, new ComponentName(context, CourseUpdateJobService.class))
                .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                .setPersisted(true)
                .setPeriodic(CHECK_INTERVAL_MS, CHECK_FLEX_MS)
                .build();
        scheduler.schedule(job);
    }

    @Override
    public boolean onStartJob(JobParameters parameters) {
        updateThread = new Thread(() -> {
            try {
                checkForCourseUpdate();
            } finally {
                jobFinished(parameters, false);
            }
        }, "course-update-check");
        updateThread.start();
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters parameters) {
        if (updateThread != null) updateThread.interrupt();
        return true;
    }

    private void checkForCourseUpdate() {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(ENDPOINT + "?time=" + System.currentTimeMillis()).openConnection();
            connection.setConnectTimeout(8000);
            connection.setReadTimeout(10000);
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("User-Agent", "MathematicsTextbook/1.1");
            if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) return;

            String response = readText(connection.getInputStream(), 64 * 1024);
            JSONObject manifest = new JSONObject(response);
            String remoteVersion = manifest.optString("version", "");
            if (!VERSION_PATTERN.matcher(remoteVersion).matches()) return;

            String bundledVersion = readBundledVersion();
            String lastNotified = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
                    .getString(LAST_NOTIFIED_VERSION, "");
            if (remoteVersion.equals(bundledVersion) || remoteVersion.equals(lastNotified)) return;

            if (showUpdateNotification()) {
                getSharedPreferences(PREFERENCES, MODE_PRIVATE)
                        .edit()
                        .putString(LAST_NOTIFIED_VERSION, remoteVersion)
                        .apply();
            }
        } catch (Exception ignored) {
            // A failed background check must never affect offline reading.
        } finally {
            if (connection != null) connection.disconnect();
        }
    }

    private String readBundledVersion() {
        try (InputStream stream = getAssets().open("public/mathematics/index.html")) {
            Matcher matcher = BUNDLED_VERSION_PATTERN.matcher(readText(stream, 256 * 1024));
            return matcher.find() ? matcher.group(1) : "";
        } catch (Exception ignored) {
            return "";
        }
    }

    private boolean showUpdateNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
                checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            return false;
        }

        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager == null) return false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "课程更新",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("发现新的数学课程内容时通知");
            manager.createNotificationChannel(channel);
        }

        Intent intent = getPackageManager().getLaunchIntentForPackage(getPackageName());
        if (intent == null) return false;
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(this, CHANNEL_ID)
                : new Notification.Builder(this);
        builder.setSmallIcon(android.R.drawable.stat_sys_download_done)
                .setContentTitle("数学教材有新内容")
                .setContentText("打开应用查看更新内容，并选择是否下载。")
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setOnlyAlertOnce(true);
        manager.notify(NOTIFICATION_ID, builder.build());
        return true;
    }

    private static String readText(InputStream stream, int maximumBytes) throws Exception {
        StringBuilder output = new StringBuilder();
        int readCharacters = 0;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            char[] buffer = new char[4096];
            int count;
            while ((count = reader.read(buffer)) != -1) {
                readCharacters += count;
                if (readCharacters > maximumBytes) throw new IllegalStateException("Response is too large");
                output.append(buffer, 0, count);
            }
        }
        return output.toString();
    }
}
