 v a r   t o w e r s   =   { 
 
         / * *   @ p a r a m   { G a m e }   g a m e   * * / 
         t i c k :   f u n c t i o n ( r o o m )   { 
                 t o w e r s   =   r o o m . f i n d ( F I N D _ M Y _ S T R U C T U R E S ,   { 
                                         f i l t e r :   {   s t r u c t u r e T y p e :   S T R U C T U R E _ T O W E R   } 
                                 } ) 
                 _ . f o r E a c h ( t o w e r s ,   f u n c t i o n ( t o w e r ) { 
                         v a r   c l o s e s t D a m a g e d S t r u c t u r e   =   t o w e r . p o s . f i n d C l o s e s t B y R a n g e ( F I N D _ S T R U C T U R E S ,   { 
                                 f i l t e r :   ( s t r u c t u r e )   = >   s t r u c t u r e . h i t s   <   s t r u c t u r e . h i t s M a x 
                         } ) ; 
                         i f ( c l o s e s t D a m a g e d S t r u c t u r e )   { 
                                 t o w e r . r e p a i r ( c l o s e s t D a m a g e d S t r u c t u r e ) ; 
                         } 
                         v a r   c l o s e s t H o s t i l e   =   t o w e r . p o s . f i n d C l o s e s t B y R a n g e ( F I N D _ H O S T I L E _ C R E E P S ) ; 
                         i f ( c l o s e s t H o s t i l e )   { 
                                 t o w e r . a t t a c k ( c l o s e s t H o s t i l e ) ; 
                         } 
                 } ) 
 	 } 
 } ; 
 
 m o d u l e . e x p o r t s   =   t o w e r s ;