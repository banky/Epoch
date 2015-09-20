package example.com.hackthenorth;

import java.util.ArrayList;

/**
 * Created by ianlo on 2015-09-20.
 */
public class Application {
    public static ArrayList<Site> sites;
    public static Site getSite(String name) {
        if(sites != null) {
            for(int i = 0; i < sites.size(); i++) {
                if(sites.get(i).getName().equals(name)){
                    return sites.get(i);
                }
            }
        }
        return null;
    }
}
