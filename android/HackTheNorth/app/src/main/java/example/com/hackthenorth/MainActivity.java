package example.com.hackthenorth;

import android.app.Activity;
import android.location.Location;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.Menu;
import android.view.MenuItem;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.drive.Drive;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.model.LatLng;

import java.util.ArrayList;

public class MainActivity extends Activity implements
        GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {
    GoogleApiClient mGoogleApiClient;
    ArrayList<Site> exploreSites;
    LinearLayoutManager layoutManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        exploreSites = new ArrayList<Site>();

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
        RVAdapter adapter = new RVAdapter(exploreSites, this);
        recyclerView.setAdapter(adapter);
        exploreSites.add(new Site("Hack the North", new LatLng(43.472831, -80.540430), 9001));
        exploreSites.add(new Site("CN Tower", new LatLng(43.642225, -79.387046), 10));
        exploreSites.add(new Site("Algonquin Park", new LatLng(45.837167, -78.379875), 50));
        exploreSites.add(new Site("Toronto Zoo", new LatLng(43.817658, -79.186030), 15));
        exploreSites.add(new Site("Niagara Falls", new LatLng(43.086621, -79.070959), 50));
        exploreSites.add(new Site("Parliament Hill", new LatLng(45.424840, -75.699400), 100));

    }
    @Override
    protected void onResume() {
        super.onResume();

        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.locationRecyclerView);
        RVAdapter adapter = new RVAdapter(exploreSites, this);
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

        //noinspection SimplifiableIfStatement
//        if (id == R.id.action_settings) {
//            return true;
//        }

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
