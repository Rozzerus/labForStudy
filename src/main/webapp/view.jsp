<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    String ename=request.getParameter("empno");
    if (ename == null){
        ename = "";
    }
%>

<sql:query var="emp" dataSource="jdbc/mbdb">
    SELECT f.empno, f.ename, f.job, s.ename as mgr, f.hiredate, f.sal, f.comm, d.dname as deptno
    FROM lab.emp as f
    left join lab.emp as s on s.empno = f.mgr
    left join lab.dept as d on d.deptno = f.deptno
    where f.ename like  '%<%= ename%>%';
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
<input onclick="location.href='/log'"  type="submit" name="Submit" value="Log" style="background-color:#63656d;font-weight:bold;color:#eeeeee;">
<form action = "view.jsp" method = "GET" >
    <input  type="submit" name="Submit" value="Searching" style="background-color:#1d6d24;font-weight:bold;color:#dddddd;">
    <input type="text" name="ename" >
</form>
<br/>
<div class="col-md-7">
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
            <tr id="${row.empno}" >
                <form action = "editor.jsp" method = "GET" >
                    <td><input type="text" name="empno" value="${row.empno}"></td>
                    <td><input type="text" name="ename" value="${row.ename}"></td>
                    <td><input type="text" name="job" value="${row.job}"></td>
                    <td><input type="text" name="mgr" value="${row.mgr}"></td>
                    <td><input type="text" name="hiredate" value="${row.hiredate}"></td>
                    <td><input type="text" name="sal" value="${row.sal}"></td>
                    <td><input type="text" name="deptno" value="${row.deptno}"></td>
                    <td><input type="submit" name="Submit" value="Update" style="background-color:#54777D;font-weight:bold;color:#dddddd;"></td>
                </form>
                <td><input onclick="
                        if (confirm('Do you want to delete the person and all his subordinates on the database?')) {
                            location.href='/delete?empno=${row.empno}'
                        } else {
                            // Do nothing!
                        }
                        "  type="submit" name="Submit" value="Delete" style="background-color:#6d1e22;font-weight:bold;color:#eeeeee;"></td>
            </tr>
        </c:forEach>
        <tr>
            <form action = "add.jsp" method = "GET" >
                <td>id</td>
                <td><input type="text" name="ename" ></td>
                <td><input type="text" name="job" ></td>
                <td><input type="text" name="mgr"></td>
                <td><input type="text" name="hiredate" ></td>
                <td><input type="text" name="sal" ></td>
                <td><input type="text" name="deptno" ></td>
                <td><input type="submit" name="Submit" value="Add" style="background-color:#49743D;font-weight:bold;color:#ffffff;"></td>
            </form>
        </tr>
        <edit></edit>
    </table>
</div>

</body>
</html>

