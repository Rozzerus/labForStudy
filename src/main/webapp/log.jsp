<%@ page import="java.sql.Timestamp" %>
<%@ taglib prefix="sql" uri="http://java.sun.com/jstl/sql" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>


<%
    String from=request.getParameter("from");
    String to=request.getParameter("to");
    if (from == null || to == null){
        from = "1000-01-01";
        to = new Timestamp(System.currentTimeMillis()).toString();
    }
%>

<sql:query var="log" dataSource="jdbc/mbdb">
    SELECT change_name, change_data, change_emp
    FROM lab.emp_change
    where change_data between  '<%= from%>' and '<%= to%>';
</sql:query>


<form action = "log.jsp" method = "GET" >
    <input type="date" name="from" value="${from}">
    <input type="date" name="to" value="${to}">
    <input type="submit" name="Submit" value="Search" style="background-color:#54777D;font-weight:bold;color:#dddddd;">
</form>

<table id="map"  class="table table-hover">
<tr class="info">
    <th>PersonID</th>
    <th>Type</th>
    <th>Date</th>
</tr>
<c:forEach var="row" items="${log.rows}">
        <tr>
            <td>${row.change_emp}</td>
            <td>${row.change_name}</td>
            <td>${row.change_data}</td>
        </tr>

</c:forEach>
</table>
