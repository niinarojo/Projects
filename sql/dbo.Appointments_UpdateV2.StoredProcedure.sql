USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_UpdateV2]    Script Date: 9/22/2023 11:29:11 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Niina Rojo
-- Create date:		08/21/2023
-- Description:		Update proc for dbo.Appointments
-- Code Reviewer:	Joseph Rodrigues

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

-- =============================================
ALTER PROC [dbo].[Appointments_UpdateV2]
      			@AppointmentTypeId int
      		 ,@ClientId int
           ,@Notes nvarchar(2000) = NULL
           ,@LocationId int
		       ,@IsConfirmed bit
           ,@AppointmentStart datetime2(7)
           ,@AppointmentEnd datetime2(7)
           ,@UserId int
		       ,@LocationTypeId int  
           ,@LineOne nvarchar(255)
           ,@LineTwo nvarchar(255) = NULL
           ,@City nvarchar(255)
           ,@Zip nvarchar(50)
           ,@StateId int
           ,@Latitude float
    		   ,@Longitude float
    		   ,@Id int

as

/*

Declare		@Id int = 39

Declare		@AppointmentTypeId int = 1
			     ,@ClientId int = 409
           ,@Notes nvarchar(2000) = 'Test notes'
           ,@LocationId int = 2
		       ,@IsConfirmed bit = 1
           ,@AppointmentStart datetime2(7) = '2023-08-23 08:30:20'
           ,@AppointmentEnd datetime2(7) = '2023-08-23 09:30:20'
           ,@UserId int = 130
		       ,@LocationTypeId int  = 1
           ,@LineOne nvarchar(255) = '123 Pretty Street'
           ,@LineTwo nvarchar(255)=NULL
           ,@City nvarchar(255) = 'Scottsdale'
           ,@Zip nvarchar(50) = '13456'
           ,@StateId int = 2
           ,@Latitude float = 12
		       ,@Longitude float = 12


		  
Execute [dbo].[Appointments_UpdateV2]
		        @AppointmentTypeId
			     ,@ClientId
           ,@Notes
           ,@LocationId
		       ,@IsConfirmed
           ,@AppointmentStart
           ,@AppointmentEnd
           ,@UserId 
    		  ,@LocationTypeId 
    			,@LineOne 
    			,@LineTwo 
    			,@City 
    			,@Zip 
    			,@StateId 
    			,@Latitude 
    			,@Longitude
    			,@Id


*/


BEGIN TRY 
	BEGIN TRANSACTION

UPDATE [dbo].[Appointments]
		SET [AppointmentTypeId] = @AppointmentTypeId
			  ,[ClientId] = @ClientId
			  ,[Notes] = @Notes
			  ,[LocationId] = @LocationId
			  ,[IsConfirmed] = @IsConfirmed
			  ,[AppointmentStart] = @AppointmentStart
			  ,[AppointmentEnd] = @AppointmentEnd
			  ,[DateModified] = GETUTCDATE()
			  ,[ModifiedBy] = @UserId
			  FROM dbo.Appointments as a left join dbo.Locations as l
			  on a.LocationId = l.Id
		 WHERE a.Id = @Id

UPDATE dbo.Locations
		SET  [LocationTypeId] = @LocationTypeId
		   ,[LineOne] = @LineOne
		   ,[LineTwo] = @LineTwo
		   ,[City] = @City
		   ,[Zip] = @Zip
		   ,[StateId] = @StateId 
		   ,[Latitude] = @Latitude
		   ,[Longitude] = @Longitude
		   ,[CreatedBy] = @UserId
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


