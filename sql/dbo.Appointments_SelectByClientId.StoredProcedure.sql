USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_SelectByClientIdV2]    Script Date: 9/22/2023 11:21:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		 Niina Rojo
-- Create date:		08/14/2023
-- Description:		Select By ClientId proc for dbo.Appointments after clientId FK was changed from dbo.Users to dbo.Clients
-- Code Reviewer:	Erik

-- MODIFIED BY: 
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note:

-- =============================================

ALTER proc [dbo].[Appointments_SelectByClientId]
			@PageIndex int
   			,@PageSize int
			,@ClientId int

as

/*

	Declare @ClientId int = 285
	Declare @PageIndex int = 0
	Declare @PageSize int = 100


	Execute [dbo].[Appointments_SelectByClientId]
			@PageIndex
   			,@PageSize
			,@ClientId


*/


BEGIN

Declare @offset int = @PageIndex * @PageSize

SELECT     a.[Id]
      	  ,a.[AppointmentTypeId]
	  ,act.[Name]
	  ,a.[ClientId]
	  ,c.[FirstName] as ClientFirstName
	  ,c.[LastName] as ClientLastName
	  ,c.[Phone] as ClientPhone
	  ,c.[Email] as ClientEmail
          ,a.[Notes]
          ,a.[LocationId]
  	  ,lt.[Id] as LocationTypeId
  	  ,lt.[Name] as LocationType
  	  ,l.[LineOne]
  	  ,l.[LineTwo]
  	  ,l.[City]
  	  ,l.[Zip]
  	  ,s.[Id] as StateId
  	  ,s.[Name] as StateName
  	  ,s.[Code] as StateCode
  	  ,l.[Latitude]
  	  ,l.[Longitude]
      	  ,a.[IsConfirmed]
     	  ,a.[AppointmentStart]
          ,a.[AppointmentEnd]
          ,a.[DateCreated]
          ,a.[DateModified]
          ,u.[Id] as UsersId
  	  ,u.[FirstName] as UserFirstName
  	  ,u.[LastName] as UserLastName
  	  ,u.[Mi] as UserMi
  	  ,u.[AvatarUrl] as UserAvatar
          ,a.[ModifiedBy]
	  ,[TotalCount] = Count(1) over()
  FROM [dbo].[Appointments] as a
	inner join [dbo].[AppointmentTypes] as act on act.Id = a.AppointmentTypeId
	inner join [dbo].[Clients] as c on c.Id = a.ClientId
	left join [dbo].[Locations] as l on l.Id = a.LocationId
	left join [dbo].[LocationTypes] as lt on lt.Id = l.LocationTypeId
	left join [dbo].[States] as s on s.Id = l.StateId
	left join [dbo].[Users] as u on a.CreatedBy = u.Id
	WHERE a.ClientId = @ClientId AND a.StatusId = 1
	ORDER BY ClientId

	OFFSET @offSet Rows
  Fetch Next @PageSize Rows ONLY


END


