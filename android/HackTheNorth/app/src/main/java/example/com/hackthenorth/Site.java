package example.com.hackthenorth;

import android.util.Log;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.io.Serializable;

/**
 * Created by ianlo on 2015-09-19.
 */
public class Site implements Serializable, Comparable<Site>{
    private String name;
    private double latitude;
    private double longitude;

    public Site(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String s) {
        name = s;
    }

    public static byte[] getSerialized(Site s) {
        // Serialize the object.
        byte[] serialized = null;
        // The byte array will contain the serialized object
        ByteArrayOutputStream bos = new ByteArrayOutputStream();

        try {
            // Use an objectoutput to write the object to a byte[]
            ObjectOutput out = new ObjectOutputStream(bos);
            out.writeObject(s);
            out.close();

            // Get the bytes of the serialized object.
            serialized = bos.toByteArray();

        } catch (IOException ioe) {
            Log.e("SerializationError",
                    "Error serializing site for the database", ioe);

        }
        return serialized;
    }

    public static Site deserialize(byte[] serialized) {
        Site s = null;
        try {
            //This time, use an objectinputstream to deserialize the byte[]
            ObjectInputStream in = new ObjectInputStream(
                    new ByteArrayInputStream(serialized));
            //Add the newly deserialized Payment object to the array that will be returned
            s = (Site) in.readObject();
            in.close();

        } catch (IOException ioe) {
            Log.e("DeserializationError", "Error deserializing a site", ioe);

        } catch (ClassNotFoundException e) {
            Log.e("DeserializationError", "Error deserializing a site", e);

            e.printStackTrace();
        }
        return s;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    @Override
    public int compareTo(Site a) {
        return getName().compareTo(a.getName());
    }

}
