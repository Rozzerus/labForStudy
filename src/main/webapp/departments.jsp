<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    String ename=request.getParameter("empno");
    if (ename == null){
        ename = "";
    }
%>

<sql:query var="dept" dataSource="jdbc/mbdb">
    SELECT deptno, dname, loc
    FROM lab.dept;

</sql:query>


<html>
<head>
    <title>View</title>
    <link rel="stylesheet" href="/lib/bootstrap/css/bootstrap.min.css">
    <script src="/lib/jquery/jquery-2.2.4.min.js"></script>

</head>
<body>
<input onclick="location.href='/departments'"  type="submit" name="Submit" value="Department" style="background-color:#63656d;font-weight:bold;color:#eeeeee;">
<input onclick="location.href='/view'"  type="submit" name="Submit" value="View" style="background-color:#63656d;font-weight:bold;color:#eeeeee;">
<input onclick="location.href='/log.txt'"  type="submit" name="Submit" value="Log" style="background-color:#63656d;font-weight:bold;color:#eeeeee;">
<form action = "view.jsp" method = "GET" >
    <input  type="submit" name="Submit" value="Searching" style="background-color:#1d6d24;font-weight:bold;color:#dddddd;">
    <input type="text" name="ename" >
</form>
<br/>
<div class="col-md-7">
    <h3>departments:</h3>
    <table id="map"  class="table table-hover">
        <tr class="info">
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
        </tr>
        <c:forEach var="row" items="${dept.rows}">
            <tr id="${row.deptno}" >
                <form action = "editor.jsp" method = "GET" >
                    <td><input type="text" name="deptno" value="${row.deptno}"></td>
                    <td><input type="text" name="dname" value="${row.dname}"></td>
                    <td><input type="text" name="loc" value="${row.loc}"></td>
                    <td><input type="submit" name="Submit" value="Update" style="background-color:#54777D;font-weight:bold;color:#dddddd;"></td>
                </form>
                <td><input onclick="location.href='/delete?deptno=${row.deptno}'"  type="submit" name="Submit" value="Delete" style="background-color:#6d1e22;font-weight:bold;color:#eeeeee;"></td>
            </tr>
        </c:forEach>
        <tr>
            <form action = "add.jsp" method = "GET" >
                <td>deptno</td>
                <td><input type="text" name="dname" ></td>
                <td><input type="text" name="loc" ></td>
                <td><input type="submit" name="Submit" value="Add" style="background-color:#49743D;font-weight:bold;color:#ffffff;"></td>
            </form>
        </tr>
        <edit></edit>
    </table>
</div>

</body>
</html>

