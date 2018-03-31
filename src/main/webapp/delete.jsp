<%@ page import="com.rozzer.lab.l11.JMSSender"%>
<%@ page import="java.io.File" %>
<%@ page import="java.io.FileWriter" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    String empno=request.getParameter("empno");
%>
<sql:update var="emp" dataSource="jdbc/mbdb">
    DELETE FROM  lab.emp
    WHERE empno=<%= empno%>;

</sql:update>
<%
    String str = "Delete person by id = " +empno+String.format("%n");
    FileWriter fileWriter = new FileWriter(new File("D:\\study\\labForStudy\\src\\main\\webapp\\log.txt"),true);
    fileWriter.write(str);

    fileWriter.close();
%>
<%
    JMSSender.getInstance().send("",System.currentTimeMillis(),request.getParameter("empno"),"DELETE");

    response.sendRedirect("/view.jsp");
%>

