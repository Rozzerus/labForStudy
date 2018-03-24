<%@ page import="java.io.File" %>
<%@ page import="java.io.FileWriter" %>
<%@ page import="java.sql.Date" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    String empno=request.getParameter("empno");
    String ename=request.getParameter("ename");
    String job=request.getParameter("job");
    String mgr=request.getParameter("mgr");
    Date hiredate=Date.valueOf(request.getParameter("hiredate"));
    String sal=request.getParameter("sal");
    String deptno=request.getParameter("deptno");
%>

<%
    String str = "Edit person by id = " +empno+" new params: ename =" +ename+" job = "+job+ " mgr = "+mgr+" hiredate = "+hiredate+" sal = "+sal+String.format("%n");
    FileWriter fileWriter = new FileWriter (new File("D:\\study\\labForStudy\\src\\main\\webapp\\log.txt"),true);
    fileWriter.write(str);

    fileWriter.close();
%>

<sql:update var="emp" dataSource="jdbc/mbdb">
    UPDATE lab.emp
    SET ename='<%= ename%>',
    job='<%= job%>',
    mgr=(select empno from lab.emp where ename = '<%= mgr%>' limit 1),
    hiredate='<%= hiredate%>',
    sal='<%= sal%>',
    deptno=(select deptno from lab.dept where dname = '<%=deptno%>' limit 1)
    WHERE empno =  '<%= empno%>';
</sql:update>

<%
    response.sendRedirect("/view.jsp");
%>


