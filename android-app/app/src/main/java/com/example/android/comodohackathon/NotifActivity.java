package com.example.android.comodohackathon;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public class NotifActivity extends AppCompatActivity {

    TextView message;
    String smdUri = "http://108.61.177.144:3000/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notif);

        Intent intent = getIntent();

        String file_name = "";
        String machine_info = "";

        message = (TextView) findViewById(R.id.messageTextView);
    }

    public void sendYes(View view){
        SendMessage yesMessage = new SendMessage();
        yesMessage.execute("true");
    }

    public void sendNo(View view){
        SendMessage yesMessage = new SendMessage();
        yesMessage.execute("false");
    }

    public class SendMessage extends AsyncTask<String, Void, String[]> {
        private final String LOG_TAG = NotifActivity.SendMessage.class.getSimpleName();

        @Override
        protected String[] doInBackground(String... params)  {

            if(params.length == 0){
                return null;
            }

            try {
                String request = smdUri;
                URL url = new URL(request);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setDoOutput(true);
                conn.setInstanceFollowRedirects(false);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("answer", params[0]);
                Intent intent = new Intent(getApplicationContext(),MainActivity.class);
                startActivity(intent);
            }
            catch (IOException e){
                Log.e(LOG_TAG, "Error Message: ", e);
            }
            return null;
        }
    }
}
