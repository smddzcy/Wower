package com.example.android.comodohackathon;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    ArrayList<String> logs;
    ArrayAdapter mLogAdapter;
    Toolbar toolbar;
    String smdLogUri = "http://108.61.177.144:3000/logs";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        toolbar = (Toolbar)findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setTitle("Wower");
        }

        logs = new ArrayList<>();

        mLogAdapter = new ArrayAdapter<String>(this, R.layout.list_logs, logs);

        ListView listview_forecast = (ListView) findViewById(R.id.listView);

        listview_forecast.setAdapter(mLogAdapter);

        FetchLogTask logTask = new FetchLogTask();
        logTask.execute();
    }

    public void sendMessage(View view){
        Intent intent = new Intent(this, NotifActivity.class);
        startActivity(intent);
    }

    public class FetchLogTask extends AsyncTask<String, Void, String[]> {
        private final String LOG_TAG = FetchLogTask.class.getSimpleName();

        @Override
        protected void onPostExecute(String[] strings) {
            super.onPostExecute(strings);

            if(strings != null){
                mLogAdapter.clear();
                mLogAdapter.addAll(strings);
            }
        }

        @Override
        protected String[] doInBackground(String... params) {

            // These two need to be declared outside the try/catch
            // so that they can be closed in the finally block.
            HttpURLConnection urlConnection = null;
            BufferedReader reader = null;

            // Will contain the raw JSON response as a string.
            String logJsonStr = null;

            try {
                URL url = new URL(smdLogUri);

                // Create the request to OpenWeatherMap, and open the connection
                urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.setRequestMethod("GET");
                urlConnection.connect();

                // Read the input stream into a String
                InputStream inputStream = urlConnection.getInputStream();
                StringBuffer buffer = new StringBuffer();
                if (inputStream == null) {
                    // Nothing to do.
                    return null;
                }
                reader = new BufferedReader(new InputStreamReader(inputStream));

                String line;
                while ((line = reader.readLine()) != null) {
                    // Since it's JSON, adding a newline isn't necessary (it won't affect parsing)
                    // But it does make debugging a *lot* easier if you print out the completed
                    // buffer for debugging.
                    buffer.append(line + "\n");
                }

                if (buffer.length() == 0) {
                    // Stream was empty.  No point in parsing.
                    return null;
                }
                logJsonStr = buffer.toString();

            } catch (IOException e) {
                Log.e(LOG_TAG, "Error ", e);
                // If the code didn't successfully get the weather data, there's no point in attemping
                // to parse it.
                return null;
            } finally{
                if (urlConnection != null) {
                    urlConnection.disconnect();
                }
                if (reader != null) {
                    try {
                        reader.close();
                    } catch (final IOException e) {
                        Log.e(LOG_TAG, "Error closing stream", e);
                    }
                }
            }

            try{
                return getLogDataFromJson(logJsonStr);
            } catch (JSONException e){
                Log.e(LOG_TAG, e.getMessage(), e);
                e.printStackTrace();
            }

            return null;
        }

        /**
         * Take the String representing the complete forecast in JSON Format and
         * pull out the data we need to construct the Strings needed for the wireframes.
         *
         * Fortunately parsing is easy:  constructor takes the JSON string and converts it
         * into an Object hierarchy for us.
         */
        private String[] getLogDataFromJson(String logJsonStr)
                throws JSONException {

            JSONObject logJson = new JSONObject(logJsonStr);
            JSONArray logArray = logJson.getJSONArray("logs");

            String[] resultStrs = new String[logArray.length()];

            for(int i = 0; i < logArray.length(); i++) {
                String id;
                String ip_address;
                String uname;

                JSONObject fileLog = logArray.getJSONObject(i);
                
                id = fileLog.getString("id");
                ip_address = fileLog.getString("ip_address");

                JSONObject machineObject = fileLog.getJSONObject("machine_info");
                uname= machineObject.getString("uname");

                resultStrs[i] = "Log ID: " + id + " - IP Adress: " + ip_address + " - Machine Info: " + uname;
            }
            return resultStrs;

        }
    }
}
