<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<sql:query var="emp" dataSource="jdbc/mbdb">
    SELECT f.empno, f.ename, f.job, s.ename as mgr, f.hiredate, f.sal, f.comm, d.dname as deptno
    FROM lab.emp as f
    left join lab.emp as s on s.empno = f.mgr
    left join lab.dept as d on d.deptno = f.deptno ;
</sql:query>


<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.FileInputStream" %>
<%
    /* read version */

    String realPath = application.getRealPath("/");
    if (realPath.endsWith("/") || realPath.endsWith("\\")) {
        realPath = realPath.substring(0, realPath.length() - 1);
    }
    realPath = realPath.replace("\\", "/");
    String servletPath = request.getServletPath();
    String absPath = realPath + servletPath;
    String version;
    try {
        File file = new File(absPath);
        String jspFolder = file.getParentFile().getAbsolutePath();
        String buildInfoFile = jspFolder + "/version.txt";
        StringBuilder sb = new StringBuilder();
        FileInputStream fileinputstream = new FileInputStream(buildInfoFile);
        int numberBytes = fileinputstream.available();
        byte bytearray[] = new byte[numberBytes];

        fileinputstream.read(bytearray);
        for (int i = 0; i < numberBytes; i++) {
            sb.append((char)bytearray[i]);
        }
        fileinputstream.close();
        version = sb.toString();
    } catch(Exception ex) {
        version = "version info file not found";
    }
%>

<html>
<head>
    <title>View</title>
    <link rel="stylesheet" href="/lib/bootstrap/css/bootstrap.min.css">
    <script src="/lib/jquery/jquery-2.2.4.min.js"></script>
    <script>
        $( "tr" ).click(function() {
            $( this ).slideUp();
        });
    </script>
</head>
<body>
<br/>
<div class="col-md-7">
    <h3>Version:</h3>
    <h4><%= version %></h4>
    <h3>staff:</h3>
    <table id="map"  class="table table-hover">
        <tr class="info">
            <th>ID</th>
            <th>Name</th>
            <th>Job</th>
            <th>Manager</th>
            <th>Birthday</th>
            <th>Salary</th>
            <th>Department</th>
        </tr>
        <c:forEach var="row" items="${emp.rows}">
            <tr id="${row.empno}">
                <td>${row.empno}</td>
                <td>${row.ename}</td>
                <td>${row.job}</td>
                <td>${row.mgr}</td>
                <td>${row.hiredate}</td>
                <td>${row.sal}</td>
                <td>${row.deptno}</td>
            </tr>
        </c:forEach>
    </table>
</div>

</body>
</html>
