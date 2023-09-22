USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_SelectByIdV2]    Script Date: 9/22/2023 11:23:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Niina Rojo
-- Create date:		08/14/2023
-- Description:		Select By Id proc for dbo.Appointments
-- Code Reviewer:	

-- MODIFIED BY:
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note:

-- =============================================

ALTER proc [dbo].[Appointments_SelectById]
			@Id int

as

/*

	Declare @Id int = 56


	Execute [dbo].[Appointments_SelectById]
			@Id

*/


BEGIN


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

FROM [dbo].[Appointments] as a
        inner join [dbo].[AppointmentTypes] as act on act.Id = a.AppointmentTypeId
  	inner join [dbo].[Clients] as c on c.Id = a.ClientId
  	left join [dbo].[Locations] as l on l.Id = a.LocationId
  	left join [dbo].[LocationTypes] as lt on lt.Id = l.LocationTypeId
  	left join [dbo].[States] as s on s.Id = l.StateId
  	left join [dbo].[Users] as u on a.CreatedBy = u.Id
WHERE a.Id = @Id AND a.StatusId = 1
ORDER BY a.Id



END
