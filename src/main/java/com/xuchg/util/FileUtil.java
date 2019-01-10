package com.xuchg.util;

import java.io.*;

public class FileUtil {


    public static boolean writeStringToFile(String filePath, String data) {
        PrintStream printStream = null;
        try {
            File file = new File(filePath);
            printStream = new PrintStream(new FileOutputStream(file));
            printStream.println(data);
            printStream.close();
            return true;
        } catch (FileNotFoundException e) {
            return false;
        }
    }


    public static String readFileToString(String filePath) throws Exception {
        StringBuffer sb = new StringBuffer("");
        FileReader reader = new FileReader(filePath);
        BufferedReader br = new BufferedReader(reader);
        String str = null;
        while ((str = br.readLine()) != null) {
            sb.append(str + "\r\n");
        }
        br.close();
        reader.close();
        return sb.toString();
    }


    public static void existsFile(String filePath) {
        File file = new File(filePath);
        if (!file.exists()) {
            file.mkdir();
        }
    }
}
