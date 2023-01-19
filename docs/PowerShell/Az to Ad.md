# Convert Azure Groups to Active Directory Security Group


Working at a k-12 school district, we have students in after school activites who needed badge access to the building based on their activity time. Their classes sync into Azure automatically, and our security software syncs from AD so we needed a way to convert the classes into security groups, and then remove students from the access groups once they were no longer in the class or activity. This is what I came up with, and since I'm new to scripting languages in general, I'm keeping a record of all of these things I come up with 🤷‍♀️

```powershell
---

install-module azuread
import-module azuread
Connect-Azuread


#Convert the Azure groups here. Add additional values as needed

$map = @{
    'Azure-Object-ID-01' = 'Active-directory-Security-Group-1' 
    'Azure-Object-ID-02' = 'Active-directory-Security-Group-2' 
    'Azure-Object-ID-03' = 'Active-directory-Security-Group-3'  
    'Azure-Object-ID-04' = 'Active-directory-Security-Group-4'  
}

foreach($pair in $map.GetEnumerator()) {
    $azMembers = [mailaddress[]] (get-AzureADGroupMember -ObjectID $pair.Key).UserPrincipalName
    foreach($adGroup in $pair.Value) {
        Add-AdGroupMember -Identity $adGroup -Members $azMembers.User 
        $allusers = Get-AdGroupMember -Identity $adGroup
                    ##remove users no longer in Azure Group
                    $remove = Get-AdGroupMember -Identity $adGroup | Where-Object SamAccountName -NotIn $azMembers.User 
                    Remove-ADGroupMember -Identity $adGroup -Members $remove -Confirm:$false 
        } 
}
```

And here is a smaller example for just converting one group at a time 

```powershell
---

$azgr = 'Azure-Group-ID'
$adgr = 'AD-Group'

$azuremem = [mailaddress[]] (get-AzureADGroupMember -ObjectId $azgr).UserPrincipalName

Add-ADGroupMember -Identity $adgr -Members $azuremem.User
