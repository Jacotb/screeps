 v a r   u t i l P o s i t i o n   =   r e q u i r e ( ' u t i l . p o s i t i o n ' ) ; 
 
 m o d u l e . e x p o r t s   =   { 
         t i c k :   f u n c t i o n ( r o o m ) { 
                 t h i s . b u i l d M i n i n g C o n t a i n e r s ( r o o m ) ; 
         } , 
         
         b u i l d M i n i n g C o n t a i n e r s :   f u n c t i o n ( r o o m ) { 
                 i f   ( r o o m . m e m o r y . c o n t a i n e r C o n s t r u c t i o n S i t e s C r e a t e d   = = =   u n d e f i n e d ) { 
                         i f   ( _ . e v e r y ( u t i l P o s i t i o n . g e t M i n i n g S p o t s ( r o o m ) ,   f u n c t i o n ( m i n e r S p o t ) { 
                                 i f   ( _ . e v e r y ( m i n e r S p o t . l o o k F o r ( L O O K _ C O N S T R U C T I O N _ S I T E S ) ,   f u n c t i o n ( c o n s S i t e ) { 
                                         r e t u r n   c o n s S i t e . s t r u c t u r e T y p e   ! =   S T R U C T U R E _ C O N T A I N E R ; 
                                 } )   & &   _ . e v e r y ( m i n e r S p o t . l o o k F o r ( L O O K _ S T R U C T U R E S ) ,   f u n c t i o n ( s t r u c t u r e ) { 
                                         r e t u r n   s t r u c t u r e . s t r u c t u r e T y p e   ! =   S T R U C T U R E _ C O N T A I N E R ; 
                                 } ) ) { 
                                         r e t u r n   r o o m . c r e a t e C o n s t r u c t i o n S i t e ( m i n e r S p o t ,   S T R U C T U R E _ C O N T A I N E R )   = =   O K ; 
                                 }   e l s e   { 
                                         r e t u r n   t r u e ; 
                                 } 
                         } ) )   { 
                                 r o o m . m e m o r y . c o n t a i n e r C o n s t r u c t i o n S i t e s C r e a t e d   =   t r u e ; 
                         } 
                 } 
         } 
 } ;