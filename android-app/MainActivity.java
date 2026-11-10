package com.tanzim.iutlearning;

import android.os.Bundle;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (bridge != null) {
                    WebView webView = bridge.getWebView();

                    if (webView != null && webView.canGoBack()) {
                        webView.goBack();
                        return;
                    }
                }

                // At the app's first page, the system Back button exits normally.
                finish();
            }
        });
    }
}
