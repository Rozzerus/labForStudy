package com.rozzer.lab.bigdata;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;
import java.util.Iterator;

public class ReduceClass extends Reducer{

    @Override
    protected void reduce(Object key, Iterable values, Context context) throws IOException, InterruptedException {
        int sum = 0;
        Iterator valuesIt = values.iterator();
        while(valuesIt.hasNext()){
            sum = sum + (Integer) valuesIt.next();
        }
        context.write(key, new IntWritable(sum));
    }
}
