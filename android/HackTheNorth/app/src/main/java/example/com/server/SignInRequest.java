package example.com.server;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.util.Log;

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

import example.com.hackthenorth.MainActivity;

/**
 * Created by ianlo on 2015-09-19.
 */
public class SignInRequest extends AsyncTask{

    String responseString;
    String email, first, last;
    Context context;
    ProgressDialog pd;
    public SignInRequest(String email, String first, String last, Context context) {
        this.email = email;
        this.first = first;
        this.last = last;
        this.context = context;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        pd = new ProgressDialog(context);
        pd.setMessage("Loading...");
        pd.show();
    }

    @Override
    protected Object doInBackground(Object[] params) {

        HttpClient httpClient = new DefaultHttpClient();
        // replace with your url
        HttpPost httpPost = new HttpPost(ServerConstants.SERVER + "/");


        //Post Data
        List<NameValuePair> nameValuePair = new ArrayList<NameValuePair>(5);
        nameValuePair.add(new BasicNameValuePair("username", email));
        nameValuePair.add(new BasicNameValuePair("firstName", first));
        nameValuePair.add(new BasicNameValuePair("lastName", last));
        nameValuePair.add(new BasicNameValuePair("latitude", first));
        nameValuePair.add(new BasicNameValuePair("lon", first));



        //Encoding POST data
        try {
            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePair));
        } catch (UnsupportedEncodingException e) {
            // log exception
            e.printStackTrace();
        }

        //making POST request.
        try {
            HttpResponse response = httpClient.execute(httpPost);
            // write response to log
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
        pd.dismiss();
        Intent intent = new Intent(context, MainActivity.class);
        context.startActivity(intent);
    }
}
