package proj.tj.pb.consultaprocessual.mobile;

import org.apache.cordova.DroidGap;

import android.os.Bundle;

public class MainActivity extends DroidGap {

	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.setBooleanProperty("keepRunning", false);
        super.loadUrl("file:///android_asset/www/index.html");
    }

    
}
