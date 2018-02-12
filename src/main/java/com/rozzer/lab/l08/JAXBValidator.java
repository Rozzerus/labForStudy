package com.rozzer.lab.l08;

import com.rozzer.lab.l08.objects.*;

import java.util.List;

public class JAXBValidator {

    private static JAXBValidator INSTANCE = new JAXBValidator();

    private JAXBValidator() {
    }

    public static JAXBValidator getInstance() {
        return INSTANCE;
    }

    public void validate(Bookcase bookcase){
        bookcase.getBookshelfs().forEach(bookshelf ->
                bookshelf.getBooks().forEach(JAXBValidator::validatePagesSum));
    }

    private static void validatePagesSum(Book book){
        String sum = String.valueOf(count(book.getChapters(), book.getIntro()));
        Pages bookPages = book.getPages();
        if (bookPages != null) {
            if (!sum.equals(bookPages.getValue()))
                bookPages.setValue(sum);
        } else {
            bookPages = new Pages();
            bookPages.setValue(sum);
            book.setPages(bookPages);
        }
    }

    private static int count(List<Chapter> chapters, Intro intro){
        int sum = 0;
        sum+=Integer.valueOf(intro.getPages());
        for (Chapter cur: chapters)
            sum+=Integer.valueOf(cur.getPages());
        return sum;
    }
}
