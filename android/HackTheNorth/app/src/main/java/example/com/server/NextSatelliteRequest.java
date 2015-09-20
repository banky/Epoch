package example.com.server;

import android.os.AsyncTask;
import android.util.Log;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Created by ianlo on 2015-09-19.
 */
public class NextSatelliteRequest extends AsyncTask {

    String responseString;
    double latitude, longitude;
    public NextSatelliteRequest(double latitude, double longitude){
        this.latitude = latitude;
        this.longitude = longitude;
    }
    @Override
    protected Object doInBackground(Object[] params) {
        HttpClient httpclient = new DefaultHttpClient();
        HttpResponse response;
        responseString = null;
        try {
            String url = ServerConstants.SERVER + "/get-next-time-at-location?latitude=" + latitude + "&longitude=" + longitude;
            response = httpclient.execute(new HttpGet(url));
//            JSONObject object = new JSONObject(response.toString());

            StatusLine statusLine = response.getStatusLine();
            if (statusLine.getStatusCode() == HttpStatus.SC_OK) {
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                response.getEntity().writeTo(out);
                responseString = out.toString();
                out.close();
            } else {
                //Closes the connection.
                response.getEntity().getContent().close();
                throw new IOException(statusLine.getReasonPhrase());
            }        } catch (ClientProtocolException e) {
            //TODO Handle problems..
        } catch (IOException e) {
            //TODO Handle problems..
        }

        try {
            JSONObject object = new JSONObject(responseString);
            Log.d("SatRequest", responseString);

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return responseString;
    }
}
