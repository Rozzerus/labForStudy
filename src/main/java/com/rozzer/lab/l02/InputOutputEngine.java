package com.rozzer.lab.l02;

import com.rozzer.lab.l01.LabInterface;
import com.rozzer.lab.l01.ManagerData;
import com.rozzer.lab.l01.NoClassForCreateException;

import java.io.*;
import java.util.ArrayList;

public class InputOutputEngine {


    public static void outputLabInterface(LabInterface o, OutputStream out){
        o.output(out);
        try {
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static LabInterface inputLabInterface(InputStream in) throws IOException, NoClassForCreateException {
        ArrayList<byte[]> result = new ArrayList<>();
        try {
            while (in.available() > 0) {
                byte[] buffer = new byte[1000];
                in.read(buffer);
                result.add(buffer);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            in.close();
        }
        for (byte[] bytes :result) {
            StringBuilder file_string = new StringBuilder();
            for(int i = 0; i < bytes.length; i++)
            {
                file_string.append((char) bytes[i]);
            }
            String string = file_string.toString();
            String[] strings = string.split(";");
            for (String object :strings) {
                String[] field = object.split("/");
                if(field.length == 4){
                    Class clazz = validateClass(field[3]);
                    Object[] validArray = validateArray(field[2].replace("[","").replace("]","").replace(" ","").split(","), clazz);
                    return ManagerData.getInstance().addNewExperiment(field[3],validArray, validateStandard(field[1],clazz),new Integer(field[0]));
                } else {
                    throw new CanNotReadObjectException();
                }
            }
        }
        return null;
    }


    private static Class validateClass(String s) throws NoClassForCreateException {
        LabInterface labInterface = ManagerData.getInstance().getNewInstanceForClass(s);
        return labInterface.getGenericClass();
    }

    private static Object[] validateArray(String[] strArr, Class genericClazz) {
        Integer[] numArr = new Integer[strArr.length];
        try {
            for (int i = 0; i < strArr.length; i++) {
                numArr[i] = Integer.parseInt(strArr[i]);
            }
        } catch (Exception e){
            return strArr;
        }
        return numArr;
    }

    private static Object validateStandard(String s, Class genericClazz){
        try {
            return new Integer(s);
        } catch (Exception e){
            return s;
        }
    }

    public static void writeLabInterface (LabInterface o, Writer out){
        o.write(out);
        try {
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static LabInterface readLabInterface(Reader in) throws IOException {
        ArrayList<Integer> result = new ArrayList<>();
        try {
            while (in.ready()) {
                int buffer = in.read();
                result.add(buffer);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            in.close();
        }
        return null;
    }

}
