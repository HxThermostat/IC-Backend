package com.kraftful.klimate;

import android.content.res.Resources;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableArray;

import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.InputStream;
import java.io.IOException;


public class WhiteLabelModule extends ReactContextBaseJavaModule {
    WhiteLabelModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "WhiteLabelModule";
    }

    @Override
    public Map<String, Object> getConstants() {

        Resources resources = getReactApplicationContext().getResources();

        final Map<String, Object> constants = new HashMap<>();

        try {
            JSONObject json = new JSONObject(loadJSONFromAssets());

            String graphUrl = json.getString("graph_url");
            String uriScheme = json.getString("uri_scheme");
            String androidStoreID = json.getString("android_store_id");
            JSONObject lightColors = json.getJSONObject("light_colors");
            JSONObject darkColors = json.getJSONObject("dark_colors");

            constants.put("GRAPH_URL", graphUrl);
            constants.put("URI_SCHEME", uriScheme);
            constants.put("ANDROID_STORE_ID", androidStoreID);
            constants.put("LIGHT_COLORS", convertJsonToMap(lightColors));
            constants.put("DARK_COLORS", convertJsonToMap(darkColors));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return constants;
    }

    private String loadJSONFromAssets() {
        String json = null;
        try {
            InputStream is = getReactApplicationContext().getAssets().open("whitelabel.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, "UTF-8");
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
        return json;
    }


    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    private static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof  Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof  Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String)  {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }
}
