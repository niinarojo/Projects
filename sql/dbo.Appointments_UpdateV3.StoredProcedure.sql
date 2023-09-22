USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_UpdateV3]    Script Date: 9/22/2023 11:29:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:			  Niina Rojo
-- Create date:		08/22/2023
-- Description:		Update proc to update dbo.Appointments and insert into Locations
-- Code Reviewer:	Joseph

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

-- =============================================
ALTER PROC [dbo].[Appointments_UpdateV3]
      			@AppointmentTypeId int
      		 ,@ClientId int
           ,@Notes nvarchar(2000) = NULL
           ,@LocationId int
		       ,@IsConfirmed bit
           ,@AppointmentStart datetime2(7)
           ,@AppointmentEnd datetime2(7)
           ,@UserId int
    		   ,@Id int
    		   ,@LocationTypeId int  
           ,@LineOne nvarchar(255)
           ,@LineTwo nvarchar(255) = NULL
           ,@City nvarchar(255)
           ,@Zip nvarchar(50)
           ,@StateId int
           ,@Latitude float
		       ,@Longitude float



as

/*

Declare		@Id int = 3

Declare		@AppointmentTypeId int = 1
			     ,@ClientId int = 284
           ,@Notes nvarchar(2000) = 'UpdateInsert'
           ,@LocationId int = 3
		       ,@IsConfirmed bit = 1
           ,@AppointmentStart datetime2(7) = '2023-08-01 08:30:20'
           ,@AppointmentEnd datetime2(7) = '2023-08-01 09:30:20'
           ,@UserId int = 130

		       ,@LocationTypeId int  = 1
           ,@LineOne nvarchar(255) = '123 Elm Street'
           ,@LineTwo nvarchar(255)=NULL
           ,@City nvarchar(255) = 'Chicago'
           ,@Zip nvarchar(50) = '13456'
           ,@StateId int = 2
           ,@Latitude float = 12
		       ,@Longitude float = 12


		  
Execute [dbo].[Appointments_UpdateV3]
        		@AppointmentTypeId
        	 ,@ClientId
           ,@Notes
           ,@LocationId
		       ,@IsConfirmed
           ,@AppointmentStart
           ,@AppointmentEnd
           ,@UserId 
    		   ,@Id
    		   ,@LocationTypeId 
      		 ,@LineOne 
      		 ,@LineTwo 
      		 ,@City 
      		 ,@Zip 
      		 ,@StateId 
      		 ,@Latitude 
      		 ,@Longitude 



*/


BEGIN TRY 
	BEGIN TRANSACTION

		Declare @LocationsTableId int = 0
 
		EXECUTE dbo.Locations_Insert
			 @LocationTypeId
			,@LineOne
			,@LineTwo
			,@City
			,@Zip
			,@StateId
			,@Latitude 
			,@Longitude
			,@UserId
			,@LocationsTableId OUTPUT

		UPDATE [dbo].[Appointments]
		SET [AppointmentTypeId] = @AppointmentTypeId
			  ,[ClientId] = @ClientId
			  ,[Notes] = @Notes
			  ,[LocationId] = @LocationsTableId
			  ,[IsConfirmed] = @IsConfirmed
			  ,[AppointmentStart] = @AppointmentStart
			  ,[AppointmentEnd] = @AppointmentEnd
			  ,[DateModified] = GETUTCDATE()
			  ,[ModifiedBy] = @UserId
			  FROM dbo.Appointments as a left join dbo.Locations as l
			  on a.LocationId = l.Id
		 WHERE a.Id = @Id




 COMMIT TRANSACTION;

 END TRY
 
BEGIN CATCH
			
			IF @@TRANCOUNT > 0 ROLLBACK
				DECLARE @MSG NVARCHAR(2048) = ERROR_MESSAGE()
				RAISERROR (@MSG,16,1)
			ROLLBACK;
 
END CATCH


