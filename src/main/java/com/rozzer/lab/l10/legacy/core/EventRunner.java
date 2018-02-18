package com.rozzer.lab.l10.legacy.core;

import com.google.common.collect.Maps;
import javafx.css.Styleable;
import javafx.event.Event;

import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

public class EventRunner implements Function<Event, Object> {


    private static EventRunner INSTANCE = new EventRunner();
    private Map<String, Function> runnableMap = Maps.newHashMap();


    private EventRunner() {
        runnableMap.put("View", viewEvent);
/*        runnableMap.put("Editor", editorEvent);
        runnableMap.put("Searching", searchingEvent);
        runnableMap.put("Log", logEvent);*/
    }


    private Event event;

    public static EventRunner getInstance() {
        return INSTANCE;
    }


    @Override
    public Object apply(Event event) {
        INSTANCE.event = event;
        Function function = INSTANCE.runnableMap.get(((Styleable) event.getTarget()).getId());
        if (Objects.nonNull(function)){
            return function.apply(null);
        }
        return null;
    }

    private Function viewEvent = new Function() {
        @Override
        public Object apply(Object o) {
            return null;
        }
    };

    private Runnable editorEvent = new Runnable() {
        @Override
        public void run() {
            System.out.println(((Styleable)event.getTarget()).getId());
        }
    };

    private Runnable searchingEvent = new Runnable() {
        @Override
        public void run() {
            System.out.println(((Styleable)event.getTarget()).getId());
        }
    };

    private Runnable logEvent = new Runnable() {
        @Override
        public void run() {
            System.out.println(((Styleable)event.getTarget()).getId());
        }
    };
}
