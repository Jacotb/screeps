 m o d u l e . e x p o r t s   =   { 
 	 n e i g h b o u r s :   f u n c t i o n ( p o s )   { 
 	         v a r   r o o m   =   G a m e . r o o m s [ p o s . r o o m N a m e ] ; 
 	         v a r   p o s i t i o n s   =   [ ] ; 
 	         f o r   ( v a r   x   =   - 1 ;   x   < =   1 ;   x + + ) { 
 	                 f o r   ( v a r   y   =   - 1 ;   y   < =   1 ;   y + + ) { 
 	                         i f   ( x   ! =   0   | |   y   ! =   0 )   { 
 	                                 v a r   n e i g h b o u r   =   r o o m . g e t P o s i t i o n A t ( p o s . x   +   x ,   p o s . y   +   y ) ; 
 	                                 i f   ( n e i g h b o u r   ! =   n u l l ) { 
 	                                         p o s i t i o n s . p u s h ( n e i g h b o u r ) ; 
 	                                 } 
 	                         } 
 	                 } 
 	         } 
 	         r e t u r n   p o s i t i o n s ; 
 	 } , 
 	 
 	 g e t S o u r c e M i n i n g S p o t s :   f u n c t i o n ( s o u r c e )   { 
                 r e t u r n   _ . f i l t e r ( t h i s . n e i g h b o u r s ( s o u r c e . p o s ) ,   f u n c t i o n ( n e i g h b o u r )   { 
                         r e t u r n   n e i g h b o u r . l o o k F o r ( L O O K _ T E R R A I N )   ! =   ' w a l l ' ; 
                 } ) ; 
 	 } , 
 	 
 	 g e t S o u r c e M i n i n g C o n t a i n e r s :   f u n c t i o n ( s o u r c e )   { 
                 r e t u r n   _ . f i l t e r ( _ . m a p ( t h i s . g e t S o u r c e M i n i n g S p o t s ( s o u r c e ) ,   f u n c t i o n ( m i n i n g S p o t ) { 
                         r e t u r n   _ . f i n d ( m i n i n g S p o t . l o o k F o r ( L O O K _ S T R U C T U R E S ) ,   f u n c t i o n ( s t r u c t u r e ) { 
                                 r e t u r n   s t r u c t u r e . s t r u c t u r e T y p e   = =   S T R U C T U R E _ C O N T A I N E R ; 
                         } ) ; 
                 } ) ,   f u n c t i o n ( c o n t a i n e r )   { 
                         r e t u r n   c o n t a i n e r   ! = =   u n d e f i n e d ; 
                 } ) ; 
 	 } , 
 	 
 	 g e t S o u r c e M i n e r s :   f u n c t i o n ( s o u r c e )   { 
 	         r e t u r n   _ . f i l t e r ( G a m e . c r e e p s ,   f u n c t i o n ( g C r e e p ) { 
                         r e t u r n   g C r e e p . m e m o r y . r o l e   = =   ' m i n e r '   & &   g C r e e p . m e m o r y . e n e r g y S o u r c e I d   = =   s o u r c e . i d ; 
                 } ) ; 
 	 } , 
         
         g e t M i n i n g S p o t s :   f u n c t i o n ( r o o m ) { 
                 v a r   s e l f   =   t h i s ; 
                 i f   ( r o o m . m e m o r y . m i n e r S p o t s   = = =   u n d e f i n e d ) { 
                         r o o m . m e m o r y . m i n e r S p o t s   =   _ . m a p ( [ ] . c o n c a t . a p p l y ( [ ] ,   _ . m a p ( r o o m . f i n d ( F I N D _ S O U R C E S ) ,   f u n c t i o n ( s o u r c e )   { 
         	                 r e t u r n   _ . f i l t e r ( s e l f . n e i g h b o u r s ( s o u r c e . p o s ) ,   f u n c t i o n ( n e i g h b o u r )   { 
         	                         r e t u r n   n e i g h b o u r . l o o k F o r ( L O O K _ T E R R A I N )   ! =   ' w a l l ' ; 
         	                 } ) ; 
                         } ) ) ,   f u n c t i o n ( p o s )   { 
                                 r e t u r n   { x :   p o s . x ,   y :   p o s . y } ; 
                         } ) ; 
                 } 
                 
                 r e t u r n   _ . m a p ( r o o m . m e m o r y . m i n e r S p o t s ,   f u n c t i o n ( s p o t ) { 
                         r e t u r n   r o o m . g e t P o s i t i o n A t ( s p o t . x ,   s p o t . y ) ; 
                 } ) ; 
         } , 
         
         g e t M i n i n g C o n t a i n e r s :   f u n c t i o n ( r o o m ) { 
                 r e t u r n   _ . f i l t e r ( _ . m a p ( t h i s . g e t M i n i n g S p o t s ( r o o m ) ,   f u n c t i o n ( m i n i n g S p o t ) { 
                         r e t u r n   _ . f i n d ( m i n i n g S p o t . l o o k F o r ( L O O K _ S T R U C T U R E S ) ,   f u n c t i o n ( s t r u c t u r e ) { 
                                 r e t u r n   s t r u c t u r e . s t r u c t u r e T y p e   = =   S T R U C T U R E _ C O N T A I N E R ; 
                         } ) ; 
                 } ) ,   f u n c t i o n ( c o n t a i n e r )   { 
                         r e t u r n   c o n t a i n e r   ! = =   u n d e f i n e d ; 
                 } ) ; 
         } , 
         
         g e t F r e e M i n i n g C o n t a i n e r :   f u n c t i o n ( r o o m ) { 
                 r e t u r n   _ . f i n d ( t h i s . g e t M i n i n g C o n t a i n e r s ( r o o m ) ,   f u n c t i o n ( c o n t a i n e r ) { 
                         r e t u r n   ! _ . s o m e ( G a m e . c r e e p s ,   f u n c t i o n ( c r e e p ) { 
                                 r e t u r n   c r e e p . m e m o r y . r o l e   = =   ' m i n e r '   & &   c r e e p . m e m o r y . m i n i n g C o n t a i n e r I d   = =   c o n t a i n e r . i d ; 
                         } ) ; 
                 } ) ; 
         } 
 } ;