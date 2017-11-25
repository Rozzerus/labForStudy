package com.rozzer.lab.l02;

import com.rozzer.lab.l01.Lab;
import com.rozzer.lab.l01.ManagerData;
import com.rozzer.lab.l01.NoClassForCreateException;

import java.io.*;

public class InputOutputEngine {


    public static void outputLabInterface(Lab o, OutputStream out){
        o.output(out);
        try {
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static Lab inputLabInterface(InputStream in) throws IOException, NoClassForCreateException {
        BufferedReader br = new BufferedReader(new InputStreamReader(in));
        return read(br);
    }


    private static Class validateClass(String s) throws NoClassForCreateException {
        Lab lab = ManagerData.getInstance().getNewInstanceForClass(s);
        return lab.getGenericClass();
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

    public static void writeLabInterface (Lab o, Writer out){
        o.write(out);
        try {
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static Lab readLabInterface(Reader in) throws IOException, NoClassForCreateException {
        BufferedReader br = new BufferedReader(in);
        try {
            return read(br);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static Lab read(BufferedReader br) throws IOException, NoClassForCreateException {
        String string = br.readLine().replace(";","");
        String[] field = string.split("/");
        if(field.length == 4){
            Class clazz = validateClass(field[3]);
            Object[] validArray = validateArray(field[2].replace("[","").replace("]","").replace(" ","").split(","), clazz);
            return ManagerData.getInstance().addNewExperiment(field[3],validArray, validateStandard(field[1],clazz),new Integer(field[0]));
        } else {
            throw new CanNotReadObjectException();
        }
    }

}
