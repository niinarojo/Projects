USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Delete]    Script Date: 9/22/2023 11:13:12 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Niina Rojo
-- Create date:		07/29/2023
-- Description:		delete proc for dbo.Appointments that updates the status to 5
-- Code Reviewer:	Oscar

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

-- =============================================

ALTER proc [dbo].[Appointments_Delete]
			@UserId int
			,@Id int

as

/*


	Declare @Id int = 4
	Declare @UserId int = 4

	Execute [dbo].[Appointments_Delete] 
			@UserId
			,@Id


*/

BEGIN
	UPDATE [dbo].[Appointments]
   SET 
		  [StatusId] = 5
      ,[DateModified] = GETUTCDATE()
      ,[ModifiedBy] = @UserId
  WHERE Id = @Id


END





