package example.com.hackthenorth;

import android.app.Activity;
import android.app.FragmentManager;
import android.location.Location;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.drive.Drive;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;

public class SiteDetails extends Activity implements
        GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {
    GoogleApiClient mGoogleApiClient;
    MapFragment mapFragment;
    GoogleMap map;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details);
        getMapFragment().getMapAsync(new OnMapReadyCallback() {
            @Override
            public void onMapReady(GoogleMap googleMap) {
                map = googleMap;
                map.getUiSettings().setMyLocationButtonEnabled(true);
                map.getUiSettings().setMapToolbarEnabled(true);
                map.getUiSettings().setAllGesturesEnabled(true);
                Site site = Site.deserialize(getIntent().getByteArrayExtra("site"));
                map.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(site.getLatitude(), site.getLongitude()), 14));
                mGoogleApiClient = new GoogleApiClient.Builder(SiteDetails.this)
                        .addConnectionCallbacks(SiteDetails.this)
                        .addOnConnectionFailedListener(SiteDetails.this)
                        .addApi(LocationServices.API)
                        .addScope(Drive.SCOPE_FILE)
                        .build();
                mGoogleApiClient.connect();
            }
        });
        ((TextView) findViewById(R.id.countdown)).setText("ISS arriving in 10 seconds");

    }

    @Override
    protected void onResume() {
        super.onResume();
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

    private MapFragment getMapFragment() {
        FragmentManager fm = null;

        fm = getFragmentManager();


        return (MapFragment) fm.findFragmentById(R.id.map);
    }
}
