package example.com.server;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import example.com.hackthenorth.Application;
import example.com.hackthenorth.MainActivity;
import example.com.hackthenorth.Site;

/**
 * Created by ianlo on 2015-09-19.
 */
public class HereRequest extends AsyncTask {

    String responseString;
    Site site;
    double latitude, longitude;
    Context context;
    HttpResponse response;
    public HereRequest(Site site, double latitude, double longitude, Context context) {
        this.site = site;
        this.latitude = latitude;
        this.longitude = longitude;
        this.context = context;
    }

    @Override
    protected Object doInBackground(Object[] params) {

        HttpClient httpClient = new DefaultHttpClient();
        // replace with your url
        HttpPost httpPost = new HttpPost(ServerConstants.SERVER + "/here");


        //Post Data
        List<NameValuePair> nameValuePair = new ArrayList<NameValuePair>(3);
        nameValuePair.add(new BasicNameValuePair("challenge", site.getName()));
        nameValuePair.add(new BasicNameValuePair("longitude", longitude+""));
        nameValuePair.add(new BasicNameValuePair("latitude", latitude+""));

        //Encoding POST data
        try {
            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePair));
        } catch (UnsupportedEncodingException e) {
            // log exception
            e.printStackTrace();
        }

        //making POST request.
        try {
             response = httpClient.execute(httpPost);

            Log.d("Http Post Response:", response.toString());
        } catch (ClientProtocolException e) {
            // Log exception
            e.printStackTrace();
        } catch (IOException e) {
            // Log exception
            e.printStackTrace();
        }
        return responseString;
    }

    @Override
    protected void onPostExecute(Object o) {
        super.onPostExecute(o);
        // write response to log
        if(response.toString().equals("OK") || true) {
            Application.getSite(site.getName()).completed = true;
            Toast.makeText(context, "Good work!", Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(context, MainActivity.class);
            context.startActivity(intent);
        }
        else {
            Toast.makeText(context, "You're not in the right place at the right time!", Toast.LENGTH_SHORT).show();
        }
    }
}
