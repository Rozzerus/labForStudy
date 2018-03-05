<%@page import="java.sql.Connection"%>
<%@ page import="java.sql.Date" %>
<%@ page import="java.sql.DriverManager" %>
<%@ page import="java.sql.Statement" %>
<%

    String ename=request.getParameter("ename");
    String job=request.getParameter("job");
    String mgr=request.getParameter("mgr");
    Date hiredate=Date.valueOf(request.getParameter("hiredate"));
    int sal=Integer.parseInt(request.getParameter("sal"));
    int deptno=Integer.parseInt(request.getParameter("deptno"));
    try{
        Connection conn = null;
        Class.forName("com.mysql.jdbc.Driver").newInstance();
        conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/test","root", "root");
        Statement st=null;
        st=conn.createStatement();
        st.executeUpdate("insert into lab.emp (empno,ename,job,mgr,hiredate,sal,deptno) values (nextval('id_seq'),"+""+")");
        response.sendRedirect("/examples/jsp/application.jsp");
    }
    catch(Exception e){
        System.out.println(e);
    }
%>
