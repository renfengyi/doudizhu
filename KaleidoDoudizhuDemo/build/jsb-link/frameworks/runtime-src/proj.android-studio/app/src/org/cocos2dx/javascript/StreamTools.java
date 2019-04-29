package org.cocos2dx.javascript;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class StreamTools {
    /*
     * 功能：把inputStream转化为字符串
     */
    public static String readInputStream(InputStream is){
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            int len=0;
            byte[] buffer = new byte[1024];
            while((len = is.read(buffer)) != -1){
                baos.write(buffer, 0, len);
            }
            baos.close();
            is.close();
            byte[] result = baos.toByteArray();
            return new String(result);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        }

    }
}