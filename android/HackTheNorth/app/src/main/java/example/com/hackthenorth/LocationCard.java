package example.com.hackthenorth;

import android.content.Context;
import android.content.Intent;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;


public class LocationCard extends RecyclerView.ViewHolder {

    CardView cardView;
    RelativeLayout layout;
    Toolbar toolbar;
    MapFragment mapFragment;
    GoogleMap map;
    Context context;
    Site site;
    ImageView check;

    public LocationCard(final View itemView, final Context context) {
        super(itemView);
        cardView = (CardView) itemView.findViewById(R.id.cardView);
        this.context = context;
        layout = (RelativeLayout) itemView.findViewById(R.id.cardViewLayout);
//        toolbar = (Toolbar) itemView.findViewById(R.id.card_toolbar);
        check = (ImageView) itemView.findViewById(R.id.checkmark);

        cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context, SiteDetails.class);
                intent.putExtra("site", Site.getSerialized(site));
                context.startActivity(intent);
            }
        });
    }

    public void setLocation(Site site) {
        this.site = site;
        if (!site.completed) {
            check.setVisibility(View.INVISIBLE);
        }
        else {
            check.setVisibility(View.VISIBLE);
        }
//        toolbar.setTitle(site.getName());
//        toolbar.setTitleTextColor(Color.WHITE);
        ((TextView) layout.findViewById(R.id.locationName)).setText(site.getName());
//        ((TextView) layout.findViewById(R.id.pointNumber)).setText(site.getPoints()+"");

    }
}
