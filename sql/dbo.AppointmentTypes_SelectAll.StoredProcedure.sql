USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[AppointmentTypes_SelectAll]    Script Date: 9/22/2023 11:36:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:			Niina Rojo
-- Create date:		07/28/2023
-- Description:		Select all data from dbo.AppointmentTypes
-- Code Reviewer:	Joseph

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

-- =============================================

ALTER proc [dbo].[AppointmentTypes_SelectAll]

as

/*

Execute dbo.AppointmentTypes_SelectAll

*/


BEGIN

SELECT [Id]
      ,[Name]
  FROM [dbo].[AppointmentTypes]

END


