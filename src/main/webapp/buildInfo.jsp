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
        /* TODO SZ: NO! don't read the version from txt file, what if tomorrow someone remove it?
        *  set version throw the Maven/Resource check how it work for version.jsp!
        */
        String buildInfoFile = jspFolder + "/version.txt";
        StringBuilder sb = new StringBuilder();
        //TODO SZ: Don't create bicycle, just use FileUtils from apache.common.io, or java.io.Files.
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
        /* TODO SZ: never do like this.
         * If you can avoid exception avoid it! Because exception is performance killer.
         * As you can see above, you can check that file exist or not and in case it does not exist
         * just return the message below without generation the exception.
         */
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

