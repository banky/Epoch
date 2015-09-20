package example.com.hackthenorth;

import android.app.Activity;
import android.content.Intent;
import android.location.Location;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.Menu;
import android.view.MenuItem;

import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.drive.Drive;
import com.google.android.gms.location.LocationServices;

import java.util.ArrayList;
import java.util.Collections;

import example.com.server.NextSatelliteRequest;

public class MainActivity extends Activity implements
        GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {
    GoogleApiClient mGoogleApiClient;
    LinearLayoutManager layoutManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FacebookSdk.sdkInitialize(getApplicationContext());

        setContentView(R.layout.activity_main);
        if(Application.sites == null) {
            Application.sites = new ArrayList<Site>();
            Application.sites.add(new Site("Hack the North"));
            Application.sites.add(new Site("CN Tower"));
            Application.sites.add(new Site("Algonquin Park"));
            Application.sites.add(new Site("Scarborough Bluffs"));
            Application.sites.add(new Site("Niagara Falls"));
            Application.sites.add(new Site("Elora Gorge"));
            Collections.sort(Application.sites);
            Application.sites.get(0).setLatitude(43.472827);
            Application.sites.get(0).setLongitude(-80.540333);
        }

        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .addScope(Drive.SCOPE_FILE)
                .build();
        mGoogleApiClient.connect();

        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.locationRecyclerView);
        layoutManager = new LinearLayoutManager(this);

        recyclerView.setLayoutManager(layoutManager);
        RVAdapter adapter = new RVAdapter(Application.sites, this);
        recyclerView.setAdapter(adapter);

        NextSatelliteRequest nsr = new NextSatelliteRequest(Application.sites.get(0).getLatitude(), Application.sites.get(0).getLongitude());
//        nsr.execute();
    }
    @Override
    protected void onResume() {
        super.onResume();

        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.locationRecyclerView);
        RVAdapter adapter = new RVAdapter(Application.sites, this);
        recyclerView.setAdapter(adapter);
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        if (id == R.id.log_out) {
            LoginManager.getInstance().logOut();
            Application.sites = null;
            Intent intent = new Intent(this, LoginActivity.class);
            startActivity(intent);
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onConnected(Bundle bundle) {
        Location mLastLocation = LocationServices.FusedLocationApi.getLastLocation(
                mGoogleApiClient);
        if (mLastLocation != null) {
//            ((TextView) findViewById(R.id.latitudeTV)).setText(String.valueOf(mLastLocation.getLatitude()));
//            ((TextView) findViewById(R.id.longitudeTV)).setText(String.valueOf(mLastLocation.getLongitude()));
        }
    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

    }

}
