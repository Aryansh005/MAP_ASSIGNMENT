package com.zucolassignment.location

import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class LocationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val locationManager = reactContext.getSystemService(ReactApplicationContext.LOCATION_SERVICE) as LocationManager

    override fun getName(): String {
        return "LocationModule"
    }

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        if (ActivityCompat.checkSelfPermission(
                reactApplicationContext,
                android.Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(
                reactApplicationContext,
                android.Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            promise.reject("PERMISSION_DENIED", "Location permissions are not granted")
            return
        }

        val location: Location? = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
        if (location != null) {
            val result = com.facebook.react.bridge.Arguments.createMap()
            result.putDouble("latitude", location.latitude)
            result.putDouble("longitude", location.longitude)
            promise.resolve(result)
        } else {
            promise.reject("LOCATION_ERROR", "Unable to fetch location")
        }
    }
}
