<%@ page import="com.rozzer.lab.l11.JMSSender"%>
<%@ page import="java.sql.Date" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%

    String ename=request.getParameter("ename");
    String job=request.getParameter("job");
    String mgr=request.getParameter("mgr");
    Date hiredate=Date.valueOf(request.getParameter("hiredate"));
    int sal=Integer.parseInt(request.getParameter("sal"));
    String deptno=request.getParameter("deptno");
%>
<sql:update var="emp" dataSource="jdbc/mbdb">
    insert into lab.emp (empno,ename,job,mgr,hiredate,sal,deptno) values
        (nextval('lab.id_seq'),'<%= ename%>','<%= job%>'
        ,(select empno from lab.emp where ename = '<%= mgr%>' limit 1)
        ,'<%=hiredate%>',<%=sal%>
        ,(select deptno from lab.dept where dname = '<%=deptno%>' limit 1));
</sql:update>
<%
    JMSSender.getInstance().send("",System.currentTimeMillis(),"","INSERT");
    response.sendRedirect("/view.jsp");
%>
