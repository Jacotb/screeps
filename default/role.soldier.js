 m o d u l e . e x p o r t s   =   { 
         r u n :   f u n c t i o n ( c r e e p )   { 
 	         i f ( c r e e p . r o o m . n a m e   = =   c r e e p . m e m o r y . t a r g e t )   { 
                         t a r g e t   =   c r e e p . p o s . f i n d C l o s e s t B y P a t h ( F I N D _ H O S T I L E _ C R E E P S ) 
                         i f ( ! t a r g e t )   { 
                                 t a r g e t   =   c r e e p . p o s . f i n d C l o s e s t B y P a t h ( F I N D _ H O S T I L E _ S T R U C T U R E S ) 
                         } 
                         i f ( t a r g e t )   { 
                                 r e s u l t   =   c r e e p . a t t a c k ( t a r g e t ) 
                                 i f ( r e s u l t   = =   O K ) { 
                                         
                                 } e l s e   i f ( r e s u l t   = =   E R R _ N O T _ I N _ R A N G E ) { 
                                         c r e e p . m o v e T o ( t a r g e t ) 
                                 }   
                         }   e l s e   { 
                                 c r e e p . m o v e ( _ . s a m p l e ( [ T O P ,   T O P _ R I G H T ,   R I G H T ,   B O T T O M _ R I G H T ,   B O T T O M ,   B O T T O M _ L E F T ,   L E F T ,   T O P _ L E F T ] ) ) 
                         } 
                 }   e l s e   { 
                         v a r   r o u t e   =   G a m e . m a p . f i n d R o u t e ( c r e e p . r o o m ,   c r e e p . m e m o r y . t a r g e t ) 
                         i f ( r o u t e . l e n g t h   >   0 )   { 
                                 c r e e p . m o v e T o ( c r e e p . p o s . f i n d C l o s e s t B y R a n g e ( r o u t e [ 0 ] . e x i t ) ) 
                         } 
                 } 
 	 } 
 } ;