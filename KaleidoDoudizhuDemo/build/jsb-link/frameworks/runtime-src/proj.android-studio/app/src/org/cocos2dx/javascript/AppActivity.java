/****************************************************************************
Copyright (c) 2015-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.app.AlertDialog;
import android.os.Bundle;
import org.cocos2dx.javascript.SDKWrapper;
import org.ethereum.gengine.Account;
import org.ethereum.gengine.Accounts;
import org.ethereum.gengine.Address;
import org.ethereum.gengine.Gengine;
import org.ethereum.gengine.KeyStore;
import org.json.JSONArray;

import com.cocos.analytics.CAAgent;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Environment;
import android.util.Log;

import java.io.File;

public class AppActivity extends Cocos2dxActivity {

    private static AppActivity app = null;
    /**
     *
     * @param context 上下文对象
     * @param dir  存储目录
     * @return
     */
    public static String getFilePath(Context context,String dir) {
        String directoryPath = "";
        //判断SD卡是否可用
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState()) ) {
            directoryPath = context.getExternalFilesDir(dir).getAbsolutePath() ;
            // directoryPath =context.getExternalCacheDir().getAbsolutePath() ;
        } else {
            //没内存卡就存机身内存
            directoryPath = context.getFilesDir() + File.separator + dir;
            // directoryPath=context.getCacheDir()+File.separator+dir;
        }
        File file = new File(directoryPath);
        if (!file.exists()) {//判断文件目录是否存在
            file.mkdirs();
        }
        return directoryPath;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW

        app = this;
        //Gengine.setVerbosity(5);
        //this.showAlertDialog("debug", Gengine.getHelloWorld(this.getFilePath(this, "")));
        try {
            Gengine.setDataDirectory(this.getFilePath(this, ""));
        } catch (Exception e) {
            //this.showAlertDialog("debug", "setDataDirectory not OK");
            e.printStackTrace();
        }
        SDKWrapper.getInstance().init(this);
        CAAgent.enableDebug(false);
    }
    
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
        if (CAAgent.isInited())
            CAAgent.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
        if (CAAgent.isInited())
            CAAgent.onPause(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
        if (CAAgent.isInited())
            CAAgent.onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }
        
    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    public static void showAlertDialog(final String title,final String message) {

        // 这里一定要使用 runOnUiThread
        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AlertDialog alertDialog = new AlertDialog.Builder(app).create();
                alertDialog.setTitle(title);
                alertDialog.setMessage(message);
                alertDialog.show();
            }
        });
    }
}
