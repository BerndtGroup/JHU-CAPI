param(
    [string]$tag,
    [string]$siteurl,
    [string]$sitename
)

if ($tag -and($tag -ne "refs/heads/master")) {

    if (-Not($siteurl)) {

        Throw "TeamCity parameter Site.Url is required (the url for the HTML staging site)"

    } elseif (-Not($sitename)) {

        Throw "TeamCity parameter Site.Name is required (the name of the HTML staging site in IIS)"

    } else {

        $fullurl = $tag + "." + $siteurl
        New-WebBinding -HostHeader $fullurl -IPAddress * -Name $sitename -Port 80 -Protocol http

    }

} else {

    Write-Host "Skipping archival. No new tag supplied."

}