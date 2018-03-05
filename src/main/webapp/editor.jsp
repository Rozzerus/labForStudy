<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>


<sql:query var="emp" dataSource="jdbc/mbdb">
    SELECT f.empno, f.ename, f.job, s.ename as mgr, f.hiredate, f.sal, f.comm, d.dname as deptno
    FROM lab.emp as f
    left join lab.emp as s on s.empno = f.mgr
    left join lab.dept as d on d.deptno = f.deptno
    where f.empno =  <%= request.getParameter("id")%>;
</sql:query>

<html>
<head>
    <title>BuildInfo</title>
    <link rel="stylesheet" href="/lib/bootstrap/css/bootstrap.min.css">
</head>
<body>
<br/>
<div class="col-md-7">
    <h3>ID:<b><%= request.getParameter("id") %></b></h3>
    <c:forEach var="row" items="${emp.rows}">
        <input></input>
        ${row.ename}
    </c:forEach>

</div>

</body>
</html>

