package org.cocos2dx.javascript;

import android.util.Log;

import org.ethereum.gengine.Account;
import org.ethereum.gengine.Accounts;
import org.ethereum.gengine.Address;
import org.ethereum.gengine.EngineConfig;
import org.ethereum.gengine.Enode;
import org.ethereum.gengine.Enodes;
import org.ethereum.gengine.Gengine;
import org.ethereum.gengine.KeyStore;
import org.ethereum.gengine.MnemonicInfo;
import org.ethereum.gengine.Node;
import org.ethereum.gengine.NodeConfig;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class NativeGengine {
    public static Node g_node;
    private final static String TAG = "NativeGengine";
    public static boolean setDataDirectory(final String dataDir) {
        try {
            Gengine.setDataDirectory(dataDir);
            Log.e(TAG, "setDataDirectory");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public static void clearCache() {
        try {
            Gengine.clearCache();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String createAccount(final String passphase) {
        try {
            KeyStore keystore = Gengine.newKeyStore(Gengine.LightScryptN, Gengine.LightScryptP);
            MnemonicInfo info = keystore.createAccount(passphase, Gengine.ChineseSimplified);
            JSONObject result = new JSONObject();
            try {
                result.put("pubKey", info.getPubKey());
                result.put("mnemonic", info.getMnemonic());
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return result.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "[]";
        }
    }

    public static boolean unlockAccountWithPassword(final String accountAddr, final String password) {
        try {
            KeyStore keystore = Gengine.newKeyStore(Gengine.LightScryptN, Gengine.LightScryptP);
            Address accountaddr = Gengine.newAddressFromHex(accountAddr);
            if (!keystore.hasAddress(accountaddr)) {
                return false;
            }
            Accounts accounts = keystore.getAccounts();
            int i = 0;
            long count = accounts.size();
            for (; i < count; i++) {
                Account account = accounts.get(i);
                Address addr = account.getAddress();
                String addrHex = addr.getHex().toLowerCase();
                if (accountAddr.toLowerCase().equals(addrHex)) {
                    keystore.unlock(account, password);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static String importAccountWithPassword(final String mnemonic, final String password) {
        try {
            KeyStore keystore = Gengine.newKeyStore(Gengine.LightScryptN, Gengine.LightScryptP);
            return keystore.importAccount(mnemonic, password, Gengine.ChineseSimplified);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public static String getAccounts() {
        try {
            KeyStore keystore = Gengine.newKeyStore(Gengine.LightScryptN, Gengine.LightScryptP);
            Accounts accounts = keystore.getAccounts();
            int i = 0;
            long count = accounts.size();
            JSONArray arr = new JSONArray();
            for (; i < count; i++) {
                Account account = accounts.get(i);
                Address addr = account.getAddress();
                String addrHex = addr.getHex();
                if (keystore.hasAddress(addr)) {
                    arr.put(addrHex);
                }
            }
            return arr.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "[]";
        }
    }

    public static boolean startGameEngineWithAccountAndPassword(final String account, final String password) {
        try {
            NodeConfig config = Gengine.newNodeConfig();
            EngineConfig engineconfig = Gengine.newEngineConfig();
            engineconfig.setUseAccountAddr(account);
            engineconfig.setUseAccountPassword(password);
            g_node = Gengine.newNode(config, engineconfig);
            g_node.start();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public static boolean stopGameEngine() {
        try {
            if (g_node != null) {
                g_node.stop();
                g_node = null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public static boolean isRunning() {
        return g_node != null;
    }

    public static String balanceOfAccount(final String address) {
        //String balanceUrl = "http://explorer-testnet.kaleidochain.io/token/balanceof?address=" + address;
        String balanceUrl = "http://114.67.7.100:8000/token/balanceof?address=" + address;
        balanceUrl = balanceUrl + "&token=0x7f36114173a5194f5282807db5fbcf96beac19b2";
        try {
            URL url = new URL(balanceUrl);
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("GET");
            conn.setReadTimeout(5000);

            int code = conn.getResponseCode();
            if(code == 200){
                InputStream is = conn.getInputStream();
                String result = StreamTools.readInputStream(is);
                return result;
            } else {
                return "";
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return "";
        }
    }

    public static String chargeForAccount(final String address) {
        //String chargeUrl = "http://explorer-testnet.kaleidochain.io/token/transfer?address=" + address;
        try {
            String chargeUrl = "http://114.67.7.100:8000/token/transfer?address=" + address;
            chargeUrl = chargeUrl + "&token=0x7f36114173a5194f5282807db5fbcf96beac19b2";
            URL url = new URL(chargeUrl);
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("GET");
            conn.setReadTimeout(5000);

            int code = conn.getResponseCode();
            if(code == 200){
                InputStream is = conn.getInputStream();
                String result = StreamTools.readInputStream(is);
                return result;
            } else {
                return "";
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return "";
        }
    }
}
