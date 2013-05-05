package com.warren.jqmmobiledemo;

import org.apache.cordova.DroidGap;

import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;

public class MainActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		System.setProperty("http.keepAlive", "false");
		super.onCreate(savedInstanceState);
		super.setIntegerProperty("splashscreen", R.drawable.splash);
//		if(checkNetWorkStatus()){
//			super.loadUrl("file:///android_asset/www/index.html", 3000);
//		}
		super.loadUrl("file:///android_asset/www/index.html", 3000);
	}

	
	
	/**
	 * check network Status
	 * 
	 * @return boolean
	 */

	public boolean checkNetWorkStatus() {
		boolean result;
		ConnectivityManager cm = (ConnectivityManager) this
				.getSystemService(Context.CONNECTIVITY_SERVICE);
		NetworkInfo netinfo = cm.getActiveNetworkInfo();
		if (netinfo != null && netinfo.isConnected()) { // 当前网络可用
			result = true;
		} else { // 不可用
			new AlertDialog.Builder(MainActivity.this).setMessage(
					"检查到没有可用的网络连接,请打开网络连接").setPositiveButton("确定",
					new DialogInterface.OnClickListener() {
						public void onClick(DialogInterface dialoginterface,
								int i) {
							ComponentName cn = new ComponentName(
									"com.android.settings",
									"com.android.settings.Settings");
							Intent intent = new Intent();
							intent.setComponent(cn);
							intent.setAction("android.intent.action.VIEW");
							startActivity(intent);
							finish();
						}
					}).show();
			result = false;
		}
		return result;
	}



	@Override
	protected void onPause() {
		super.onPause();
		 //关闭对话框  	     
	}
	
	 

}
