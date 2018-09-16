/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2005                    */
/* Created on:     2018/04/01 22:26:54                          */
/*==============================================================*/


if exists (select 1
            from  sysobjects
           where  id = object_id('BENTO')
            and   type = 'U')
   drop table BENTO
go

/*==============================================================*/
/* Table: BENTO                                                 */
/*==============================================================*/
create table BENTO (
   BENTO_ID             varchar(8)           null,
   BENTO_NAME           varchar(32)          null,
   BENTO_PIC            binary(2048)         null
)
go

if exists (select 1 
            from  sysproperties 
           where  id = object_id('BENTO') 
            and   type = 3) 
begin 
   declare @CurrentUser sysname 
select @CurrentUser = user_name() 
execute sp_dropextendedproperty 'MS_Description',  
   'user', @CurrentUser, 'table', 'BENTO' 
 
end 


select @CurrentUser = user_name() 
execute sp_addextendedproperty 'MS_Description',  
   '±„µ±–≈œ¢', 
   'user', @CurrentUser, 'table', 'BENTO'
go

