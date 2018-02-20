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
    <title>BuildInfo</title>
    <link rel="stylesheet" href="/lib/bootstrap/css/bootstrap.min.css">
    <script src="/lib/jquery/jquery-2.2.4.min.js"></script>
    <!--    <script>
        $(document).ready(function(){
            var trHTML = '';
            var data  =;

            $.each(data, function (key, value) {

                trHTML += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
            });

            $('#map').append(trHTML);
        })

    </script>-->
</head>
<body>
<br/>
<div class="col-md-7">
    <h3>Version:</h3>
    <h4><%= version %></h4>
    <h3>Configurations:</h3>
    <table id="map"  class="table table-hover">
        <tr class="info">
            <th>Config</th>
            <th>Value</th>
        </tr>
    </table>
</div>

</body>
</html>

