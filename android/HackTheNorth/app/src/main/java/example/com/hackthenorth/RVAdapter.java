package example.com.hackthenorth;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.ArrayList;

public class RVAdapter extends RecyclerView.Adapter{

    ArrayList<Site> targets;
    Context context;
    public RVAdapter(ArrayList<Site> targets, Context context){
        this.targets = (ArrayList<Site>) targets.clone();
        this.context = context;
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View v = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.location_card, viewGroup, false);
        LocationCard card = new LocationCard(v, context);
        return card;
    }

    @Override
    public void onBindViewHolder(RecyclerView.ViewHolder viewHolder, int i) {
        LocationCard card = (LocationCard) viewHolder;
        card.setLocation(targets.get(i));
    }

    @Override
    public int getItemCount() {
        return targets.size();
    }


}
