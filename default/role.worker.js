 v a r   u t i l M o v e   =   r e q u i r e ( ' u t i l . m o v e ' ) ; 
 v a r   u t i l P o s i t i o n   =   r e q u i r e ( ' u t i l . p o s i t i o n ' ) ; 
 
 m o d u l e . e x p o r t s   =   { 
         T a s k :   O b j e c t . f r e e z e ( { b u i l d :   1 ,   u p g r a d e :   2 ,   r e p a i r :   3 ,   t r a n s f e r :   4 ,   h a r v e s t :   5 ,   p i c k u p :   6 ,   w i t h d r a w :   7 } ) , 
         A N T I C I P A T E _ S O U R C E _ R E G E N E R A T I O N _ D U R A T I O N :   2 4 , 
 
         r u n :   f u n c t i o n ( c r e e p )   { 
                 v a r   t a s k O n g o i n g   =   f a l s e ; 
                 v a r   i t e r a t i o n s   =   0 ; 
                 w h i l e   ( ! t a s k O n g o i n g )   { 
                         i t e r a t i o n s + + ; 
                         s w i t c h ( c r e e p . m e m o r y . t a s k ) { 
                                 c a s e   t h i s . T a s k . b u i l d : 
                                         t a s k O n g o i n g   =   t h i s . b u i l d ( c r e e p ) ; 
                                         b r e a k ; 
                                 c a s e   t h i s . T a s k . u p g r a d e : 
                                         t a s k O n g o i n g   =   t h i s . u p g r a d e ( c r e e p ) ; 
                                         b r e a k ; 
                                 c a s e   t h i s . T a s k . r e p a i r : 
                                         t a s k O n g o i n g   =   t h i s . r e p a i r ( c r e e p ) ; 
                                         b r e a k ; 
                                 c a s e   t h i s . T a s k . t r a n s f e r : 
                                         t a s k O n g o i n g   =   t h i s . t r a n s f e r ( c r e e p ) ; 
                                         b r e a k ; 
                                 c a s e   t h i s . T a s k . w i t h d r a w : 
                                         t a s k O n g o i n g   =   t h i s . w i t h d r a w ( c r e e p ) ; 
                                         b r e a k ; 
                                 c a s e   t h i s . T a s k . h a r v e s t : 
                                         t a s k O n g o i n g   =   t h i s . h a r v e s t ( c r e e p ) ; 
                                         b r e a k ;   
                                 c a s e   t h i s . T a s k . p i c k u p : 
                                         t a s k O n g o i n g   =   t h i s . p i c k u p ( c r e e p ) ; 
                                         b r e a k ; 
                                 d e f a u l t : 
                                         b r e a k ; 
                         } 
                         
                         i f   ( ! t a s k O n g o i n g )   { 
                                 c r e e p . m e m o r y . t a s k   =   t h i s . f i n d T a s k ( c r e e p ) ; 
                                 t h i s . r e s e t T a s k M e m o r y ( c r e e p ) ; 
                         } 
                         
                         i f   ( i t e r a t i o n s   >   1 0 ) { 
                                 c r e e p . s a y ( ' n o   t a s k ' ) ; 
                                 b r e a k ; 
                         } 
                 } 
         } , 
         
         r e s e t T a s k M e m o r y :   f u n c t i o n ( c r e e p )   { 
                 d e l e t e   c r e e p . m e m o r y . b u i l d T a r g e t I d ; 
                 d e l e t e   c r e e p . m e m o r y . u p g r a d e T a r g e t I d ; 
                 d e l e t e   c r e e p . m e m o r y . r e p a i r T a r g e t I d ; 
                 d e l e t e   c r e e p . m e m o r y . t r a n s f e r T a r g e t I d ; 
                 d e l e t e   c r e e p . m e m o r y . h a r v e s t T a r g e t I d ; 
                 d e l e t e   c r e e p . m e m o r y . h a r v e s t S o u r c e R e g e n e r a t i o n R e t a r g e t e d ; 
                 d e l e t e   c r e e p . m e m o r y . w i t h d r a w T a r g e t I d ; 
                 d e l e t e   c r e e p . m e m o r y . p i c k u p T a r g e t I d ; 
         } , 
         
         f i n d T a s k :   f u n c t i o n ( c r e e p )   { 
                 v a r   p o t e n t i a l T a s k s   =   [ ] ; 
                 v a r   s e l f   =   t h i s ; 
                               
 	         i f ( c r e e p . c a r r y . e n e r g y   = =   0 )   { 
 	                 i f   ( _ . s o m e ( c r e e p . r o o m . f i n d ( F I N D _ D R O P P E D _ R E S O U R C E S ) ,   f u n c t i o n ( r e s o u r c e ) { 
 	                         r e t u r n   r e s o u r c e . r e s o u r c e T y p e   = =   R E S O U R C E _ E N E R G Y ; 
 	                 } ) )   { 
 	                         p o t e n t i a l T a s k s . p u s h ( s e l f . T a s k . p i c k u p ) ; 
 	                 } 
 	                 
 	                 i f   ( _ . s o m e ( c r e e p . r o o m . f i n d ( F I N D _ S O U R C E S ) ,   f u n c t i o n ( s o u r c e ) { 
 	                         r e t u r n   ( _ . s i z e ( u t i l P o s i t i o n . g e t S o u r c e M i n e r s ( s o u r c e ) )   +   _ . s i z e ( _ . f i l t e r ( G a m e . c r e e p s ,   f u n c t i o n ( c r e e p ) { 
 	                                 r e t u r n   c r e e p . m e m o r y . t a s k   = =   s e l f . T a s k . h a r v e s t   & &   c r e e p . m e m o r y . h a r v e s t T a r g e t I d   = =   s o u r c e . i d ; 
 	                         } ) )   <   _ . s i z e ( u t i l P o s i t i o n . g e t S o u r c e M i n i n g S p o t s ( s o u r c e ) ) ) ; 
 	                 } ) )   { 
 	                         p o t e n t i a l T a s k s . p u s h ( s e l f . T a s k . h a r v e s t ) ; 
 	                 } 
 	                 
 	                 i f   ( _ . s o m e ( u t i l P o s i t i o n . g e t M i n i n g C o n t a i n e r s ( c r e e p . r o o m ) ,   f u n c t i o n ( c o n t a i n e r ) { 
 	                       r e t u r n   c o n t a i n e r . s t o r e [ R E S O U R C E _ E N E R G Y ]   > =   c r e e p . c a r r y C a p a c i t y ; 
 	                 } ) )   { 
 	                         p o t e n t i a l T a s k s . p u s h ( s e l f . T a s k . w i t h d r a w ) ; 
 	                         p o t e n t i a l T a s k s . p u s h ( s e l f . T a s k . w i t h d r a w ) ; 
 	                         p o t e n t i a l T a s k s . p u s h ( s e l f . T a s k . w i t h d r a w ) ; 
 	                 } 
 	         }   e l s e   { 
 	                 i f   ( M a t h . r a n d o m ( )   <   0 . 2 ) { 
 	                         p o t e n t i a l T a s k s . p u s h ( s e l f . T a s k . u p g r a d e ) ; 
 	                 } 
 	                         
 	                 i f   ( _ . s o m e ( c r e e p . r o o m . f i n d ( F I N D _ M Y _ S T R U C T U R E S ) ,   f u n c t i o n ( s t r u c t u r e ) { 
 	                         r e t u r n   s t r u c t u r e . e n e r g y   <   s t r u c t u r e . e n e r g y C a p a c i t y   & &   ! _ . s o m e ( _ . f i l t e r ( G a m e . c r e e p s ,   f u n c t i o n ( g C r e e p ) { 
         	                         r e t u r n   g C r e e p . m e m o r y . r o l e   = =   " w o r k e r "   & &   g C r e e p . m e m o r y . t a s k   = =   s e l f . T a s k . t r a n s f e r   & &   g C r e e p . m e m o r y . t r a n s f e r T a r g e t I d   = =   s t r u c t u r e . i d   & &   ( s t r u c t u r e . e n e r g y C a p a c i t y   -   s t r u c t u r e . e n e r g y )   < =   g C r e e p . c a r r y . e n e r g y ; 
         	                 } ) ) ; 
 	                 } ) )   { 
 	                         p o t e n t i a l T a s k s . p u s h ( s e l f . T a s k . t r a n s f e r ) ; 
 	                 } 
 	                 
 	                 i f   ( ! _ . s o m e ( p o t e n t i a l T a s k s ,   f u n c t i o n ( t a s k ) { 
 	                         r e t u r n   t a s k   = =   s e l f . T a s k . t r a n s f e r ; 
 	                 } ) )   { 
         	                 i f   ( _ . s o m e ( c r e e p . r o o m . f i n d ( F I N D _ S T R U C T U R E S ) ,   f u n c t i o n ( s t r u c t u r e ) { 
                 	                 r e t u r n   s t r u c t u r e . h i t s   <   s t r u c t u r e . h i t s M a x   /   1 . 3 3 ; 
         	                 } ) )   { 
         	                         p o t e n t i a l T a s k s . p u s h ( s e l f . T a s k . r e p a i r ) ; 
         	                 } 
         	                 
         	                 i f   ( _ . s o m e ( c r e e p . r o o m . f i n d ( F I N D _ M Y _ C O N S T R U C T I O N _ S I T E S ) ) )   { 
         	                         p o t e n t i a l T a s k s . p u s h ( s e l f . T a s k . b u i l d ) ; 
 	                         } 
 	                 } 
 	         } 
 	         
 	         r e t u r n   _ . s a m p l e ( p o t e n t i a l T a s k s ) ; 
         } , 
 	 
 	 b u i l d :   f u n c t i o n ( c r e e p )   { 
 	         v a r   t a r g e t ; 
 	         i f   ( c r e e p . m e m o r y . b u i l d T a r g e t I d   = = =   u n d e f i n e d ) { 
 	                 t a r g e t   =   c r e e p . p o s . f i n d C l o s e s t B y P a t h ( F I N D _ M Y _ C O N S T R U C T I O N _ S I T E S ) ; 
         	         i f   ( t a r g e t )   { 
         	                 c r e e p . m e m o r y . b u i l d T a r g e t I d   =   t a r g e t . i d ; 
         	         }   e l s e   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         }   e l s e   { 
         	         t a r g e t   =   G a m e . g e t O b j e c t B y I d ( c r e e p . m e m o r y . b u i l d T a r g e t I d ) ; 
         	         i f   ( ! t a r g e t )   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         } 
 	         
 	         i f   ( c r e e p . c a r r y . e n e r g y   < =   0 )   { 
 	                 r e t u r n   f a l s e ; 
 	         } 
         	         
                 v a r   r e s u l t   =   c r e e p . b u i l d ( t a r g e t ) 
                 i f ( r e s u l t   = =   O K )   { 
                         c r e e p . s a y ( "�<��� " ) ; 
                 }   e l s e   i f ( r e s u l t   = =   E R R _ N O T _ I N _ R A N G E )   { 
                         u t i l M o v e . r u n ( c r e e p ,   t a r g e t ,   ' # 0 0 0 0 f f ' ,   '�<��� ' ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ I N V A L I D _ T A R G E T ) { 
                         c r e e p . r o o m . l o o k F o r A t ( L O O K _ C R E E P S ,   t a r g e t . p o s . x ,   t a r g e t . p o s . y ) . f o r E a c h ( f u n c t i o n ( b l o c k e r ) { 
                                 b l o c k e r . m o v e ( _ . s a m p l e ( [ T O P ,   T O P _ R I G H T ,   R I G H T ,   B O T T O M _ R I G H T ,   B O T T O M ,   B O T T O M _ L E F T ,   L E F T ,   T O P _ L E F T ] ) ) 
                         } ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ T I R E D )   { 
                         c r e e p . s a y ( "�=�4�<��� " ) ; 
                 }   e l s e   { 
                         c r e e p . s a y ( r e s u l t ) ; 
                 } 
                 r e t u r n   t r u e ; 
 	 } , 
 	 
 	 u p g r a d e :   f u n c t i o n ( c r e e p )   { 
 	         v a r   t a r g e t ; 
 	         i f   ( c r e e p . m e m o r y . u p g r a d e T a r g e t I d   = = =   u n d e f i n e d ) { 
 	                 t a r g e t   =   c r e e p . r o o m . c o n t r o l l e r ; 
         	         i f   ( t a r g e t )   { 
         	                 c r e e p . m e m o r y . u p g r a d e T a r g e t I d   =   t a r g e t . i d ; 
         	         }   e l s e   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         }   e l s e   { 
         	         t a r g e t   =   G a m e . g e t O b j e c t B y I d ( c r e e p . m e m o r y . u p g r a d e T a r g e t I d ) ; 
         	         i f   ( ! t a r g e t )   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         } 
 	         
 	         i f   ( c r e e p . c a r r y . e n e r g y   < =   0 )   { 
 	                 r e t u r n   f a l s e ; 
 	         } 
                 
 	         v a r   r e s u l t   =   c r e e p . u p g r a d e C o n t r o l l e r ( t a r g e t ) ; 
 	         i f ( r e s u l t   = =   O K )   { 
                         c r e e p . s a y ( "+� " ) ; 
 	         }   e l s e   i f ( r e s u l t   = =   E R R _ N O T _ I N _ R A N G E )   { 
                         u t i l M o v e . r u n ( c r e e p ,   t a r g e t ,   ' # 0 0 0 0 f f ' ,   '+� ' ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ T I R E D )   { 
                         c r e e p . s a y ( "�=�4+� " ) ; 
                 }   e l s e   { 
                         c r e e p . s a y ( r e s u l t ) 
                 } 	               
                 r e t u r n   t r u e ; 
 	 } , 
 	 
 	 r e p a i r :   f u n c t i o n ( c r e e p )   { 
 	         v a r   t a r g e t ; 
 	         i f   ( c r e e p . m e m o r y . r e p a i r T a r g e t I d   = = =   u n d e f i n e d )   { 
         	         t a r g e t   =   c r e e p . p o s . f i n d C l o s e s t B y P a t h ( F I N D _ S T R U C T U R E S ,   { f i l t e r :   f u n c t i o n ( s t r u c t u r e )   { 
         	                 r e t u r n   s t r u c t u r e . h i t s   <   s t r u c t u r e . h i t s M a x   /   1 . 3 3 ; 
         	         } } ) ; 
         	         i f   ( t a r g e t )   { 
         	                 c r e e p . m e m o r y . r e p a i r T a r g e t I d   =   t a r g e t . i d ; 
         	         }   e l s e   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         }   e l s e   { 
         	         t a r g e t   =   G a m e . g e t O b j e c t B y I d ( c r e e p . m e m o r y . r e p a i r T a r g e t I d ) ; 
         	         i f   ( ! t a r g e t )   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         } 
 	         
 	         i f   ( c r e e p . c a r r y . e n e r g y   < =   0 )   { 
 	                 r e t u r n   f a l s e ; 
 	         } 
 	         
                 i f   ( t a r g e t . h i t s   > =   t a r g e t . h i t s M a x ) { 
                         r e t u r n   f a l s e ; 
                 }   
                 
                 v a r   r e s u l t   =   c r e e p . r e p a i r ( t a r g e t ) 
                 i f ( r e s u l t   = =   O K )   { 
                         c r e e p . s a y ( "�=�' " ) ; 
                 }   e l s e   i f ( r e s u l t   = =   E R R _ N O T _ I N _ R A N G E )   { 
                         u t i l M o v e . r u n ( c r e e p ,   t a r g e t ,   ' # 0 0 f f 0 0 ' ,   '�=�' ' ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ T I R E D )   { 
                         c r e e p . s a y ( "�=�4�=�' " ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ I N V A L I D _ T A R G E T )   { 
                         r e t u r n   f a l s e ; 
                 }   e l s e   { 
                         c r e e p . s a y ( r e s u l t ) ; 
                 } 
                 r e t u r n   t r u e ; 
 	 } , 
 	 
 	 t r a n s f e r :   f u n c t i o n ( c r e e p )   { 
 	         v a r   t a r g e t ; 
 	         v a r   s e l f   =   t h i s ; 
 	         i f   ( c r e e p . m e m o r y . t r a n s f e r T a r g e t I d   = = =   u n d e f i n e d )   { 
         	         t a r g e t   =   c r e e p . p o s . f i n d C l o s e s t B y P a t h ( F I N D _ M Y _ S T R U C T U R E S ,   { f i l t e r :   f u n c t i o n ( s t r u c t u r e )   { 
         	                 r e t u r n   s t r u c t u r e . e n e r g y   <   s t r u c t u r e . e n e r g y C a p a c i t y   & &   ! _ . s o m e ( _ . f i l t e r ( G a m e . c r e e p s ,   f u n c t i o n ( g C r e e p ) { 
         	                         r e t u r n   g C r e e p . m e m o r y . r o l e   = =   " w o r k e r "   & &   g C r e e p . m e m o r y . t a s k   = =   s e l f . T a s k . t r a n s f e r   & &   g C r e e p . m e m o r y . t r a n s f e r T a r g e t I d   = =   s t r u c t u r e . i d   & &   ( s t r u c t u r e . e n e r g y C a p a c i t y   -   s t r u c t u r e . e n e r g y )   < =   g C r e e p . c a r r y . e n e r g y ; 
         	                 } ) ) ; 
         	         } } ) ; 
         	         i f   ( t a r g e t )   { 
         	                 c r e e p . m e m o r y . t r a n s f e r T a r g e t I d   =   t a r g e t . i d ; 
         	         }   e l s e   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         }   e l s e   { 
         	         t a r g e t   =   G a m e . g e t O b j e c t B y I d ( c r e e p . m e m o r y . t r a n s f e r T a r g e t I d ) ; 
         	         i f   ( ! t a r g e t )   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         } 
 	         
 	         i f   ( c r e e p . c a r r y . e n e r g y   < =   0 )   { 
 	                 r e t u r n   f a l s e ; 
 	         } 
 	         
 	         i f   ( t a r g e t . e n e r g y   > =   t a r g e t . e n e r g y C a p a c i t y )   { 
 	                 r e t u r n   f a l s e ; 
 	         } 
 	         
                 v a r   r e s u l t   =   c r e e p . t r a n s f e r ( t a r g e t ,   R E S O U R C E _ E N E R G Y ,   M a t h . m i n ( t a r g e t . e n e r g y C a p a c i t y   -   t a r g e t . e n e r g y ,   c r e e p . c a r r y . e n e r g y ) ) 
                 i f ( r e s u l t   = =   O K )   { 
                         c r e e p . s a y ( "�<߁ " ) ; 
                 }   e l s e   i f ( r e s u l t   = =   E R R _ N O T _ I N _ R A N G E )   { 
                         u t i l M o v e . r u n ( c r e e p ,   t a r g e t ,   ' # a a 0 0 0 0 ' ,   '�<߁ ' ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ T I R E D )   { 
                         c r e e p . s a y ( "�=�4�<߁ " ) ; 
                 }   e l s e   { 
                         c r e e p . s a y ( r e s u l t ) 
                 } 
                 r e t u r n   t r u e ; 
 	 } , 
 	 
 	 h a r v e s t :   f u n c t i o n ( c r e e p ) { 
 	         v a r   t a r g e t ; 
 	         
 	         v a r   r e t a r g e t   =   f a l s e ; 
 	         i f   ( c r e e p . m e m o r y . h a r v e s t T a r g e t I d   = = =   u n d e f i n e d ) { 
 	                 r e t a r g e t   =   t r u e ; 
 	         } 
 	         i f   ( ! r e t a r g e t   & &   c r e e p . m e m o r y . h a r v e s t S o u r c e R e g e n e r a t i o n R e t a r g e t e d   = = =   u n d e f i n e d   & & 
 	                         ( _ . s o m e ( c r e e p . r o o m . f i n d ( F I N D _ S O U R C E S ) ,   f u n c t i o n   ( s o u r c e ) { 
                 	                 r e t u r n   s o u r c e . t i c k s T o R e g e n e r a t i o n   <   t h i s . A N T I C I P A T E _ S O U R C E _ R E G E N E R A T I O N _ D U R A T I O N ; 
                 	         } )   | |   _ . s o m e ( c r e e p . r o o m . f i n d ( F I N D _ S O U R C E S ) ,   f u n c t i o n   ( s o u r c e ) { 
                 	                 r e t u r n   s o u r c e . e n e r g y   = =   s o u r c e . e n e r g y C a p a c i t y ; 
                 	         } ) ) 
                 	 ) { 
                 	         c r e e p . m e m o r y . h a r v e s t S o u r c e R e g e n e r a t i o n R e t a r g e t e d   =   t r u e ; 
                 	         r e t a r g e t   =   t r u e ; 
                 } 
                 
                 i f   ( r e t a r g e t )   { 
         	         t a r g e t   =   t h i s . f i n d L e a s t U t i l i z e d S o u r c e ( c r e e p ) ; 
         	         i f   ( t a r g e t )   { 
         	                 c r e e p . m e m o r y . h a r v e s t T a r g e t I d   =   t a r g e t . i d ; 
         	         }   e l s e   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         }   e l s e   { 
         	         t a r g e t   =   G a m e . g e t O b j e c t B y I d ( c r e e p . m e m o r y . h a r v e s t T a r g e t I d ) ; 
         	         i f   ( ! t a r g e t )   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         } 
 	         
 	         i f   ( c r e e p . c a r r y . e n e r g y   > =   c r e e p . c a r r y C a p a c i t y )   { 
 	                 r e t u r n   f a l s e ; 
 	         } 
 	         
                 v a r   r e s u l t   =   c r e e p . h a r v e s t ( t a r g e t ) ; 
                 i f   ( r e s u l t   = =   O K )   { 
                         c r e e p . s a y ( "&�� " ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ N O T _ I N _ R A N G E )   { 
                         r e t u r n   u t i l M o v e . r u n ( c r e e p ,   t a r g e t ,   ' # f f 0 0 0 0 ' ,   '�&�� ' ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ T I R E D )   { 
                         c r e e p . s a y ( "�=�4�&�� " ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ N O T _ E N O U G H _ R E S O U R C E S ) { 
                         i f   ( t a r g e t . t i c k s T o R e g e n e r a t i o n   <   t h i s . A N T I C I P A T E _ S O U R C E _ R E G E N E R A T I O N _ D U R A T I O N ) { 
                                 u t i l M o v e . r u n ( c r e e p ,   t a r g e t ,   ' # f f 0 0 0 0 ' ,   '�&�� ' ) ; 
                         }   e l s e   { 
                                 r e t u r n   f a l s e ; 
                         } 
                 }     e l s e   { 
                         c r e e p . s a y ( r e s u l t ) ; 
                 } 
                 r e t u r n   t r u e ; 
 	 } , 
 	 
 	 w i t h d r a w :   f u n c t i o n ( c r e e p )   { 
 	         v a r   t a r g e t ; 
 	         i f   ( c r e e p . m e m o r y . w i t h d r a w T a r g e t I d   = = =   u n d e f i n e d )   { 
 	                 t a r g e t   =   c r e e p . p o s . f i n d C l o s e s t B y P a t h (   _ . f i l t e r ( u t i l P o s i t i o n . g e t M i n i n g C o n t a i n e r s ( c r e e p . r o o m ) ,   f u n c t i o n ( c o n t a i n e r ) { 
 	                         r e t u r n   c o n t a i n e r . s t o r e [ R E S O U R C E _ E N E R G Y ]   > =   c r e e p . c a r r y C a p a c i t y ; 
 	                 } ) ) ; 
         	         i f   ( t a r g e t )   { 
         	                 c r e e p . m e m o r y . w i t h d r a w T a r g e t I d   =   t a r g e t . i d ; 
         	         }   e l s e   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         }   e l s e   { 
         	         t a r g e t   =   G a m e . g e t O b j e c t B y I d ( c r e e p . m e m o r y . w i t h d r a w T a r g e t I d ) ; 
         	         i f   ( ! t a r g e t )   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         } 
 	         
 	         i f   ( c r e e p . c a r r y . e n e r g y   > =   c r e e p . c a r r y C a p a c i t y )   { 
 	                 r e t u r n   f a l s e ; 
 	         } 
 	         
                 v a r   r e s u l t   =   c r e e p . w i t h d r a w ( t a r g e t ,   R E S O U R C E _ E N E R G Y ,   c r e e p . c a r r y C a p a c i t y   -   c r e e p . c a r r y . e n e r g y ) ; 
                 i f   ( r e s u l t   = =   O K )   { 
                         c r e e p . s a y ( '&� ' ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ N O T _ I N _ R A N G E )   { 
                         u t i l M o v e . r u n ( c r e e p ,   t a r g e t ,   ' # f f 0 0 0 0 ' ,   '&� ' ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ T I R E D )   { 
                         c r e e p . s a y ( "�=�4&� " ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ N O T _ E N O U G H _ R E S O U R C E S ) { 
                         r e t u r n   f a l s e ; 
                 }   e l s e   { 
                         c r e e p . s a y ( r e s u l t ) ; 
                 } 
                 r e t u r n   t r u e ; 
 	 } , 
 	 
 	 p i c k u p :   f u n c t i o n ( c r e e p )   { 
 	         v a r   t a r g e t ; 
 	         i f   ( c r e e p . m e m o r y . p i c k u p T a r g e t I d   = = =   u n d e f i n e d ) { 
 	                 t a r g e t   =   c r e e p . p o s . f i n d C l o s e s t B y P a t h ( F I N D _ D R O P P E D _ R E S O U R C E S ,   { f i l t e r :   f u n c t i o n ( r e s o u r c e ) { 
         	                         r e t u r n   r e s o u r c e . r e s o u r c e T y p e   = =   R E S O U R C E _ E N E R G Y ; 
         	                 } } ) ; 
         	         i f   ( t a r g e t )   { 
         	                 c r e e p . m e m o r y . p i c k u p T a r g e t I d   =   t a r g e t . i d ; 
         	         }   e l s e   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         }   e l s e   { 
         	         t a r g e t   =   G a m e . g e t O b j e c t B y I d ( c r e e p . m e m o r y . p i c k u p T a r g e t I d ) ; 
         	         i f   ( ! t a r g e t )   { 
         	                 r e t u r n   f a l s e ; 
         	         } 
 	         } 
 	         
 	         i f   ( c r e e p . c a r r y . e n e r g y   > =   c r e e p . c a r r y C a p a c i t y )   { 
 	                 r e t u r n   f a l s e ; 
 	         } 
 	         
                 v a r   r e s u l t   =   c r e e p . p i c k u p ( t a r g e t ) ; 
                 i f ( r e s u l t   = =   O K )   { 
                         c r e e p . s a y ( "�=ޜ " ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ N O T _ I N _ R A N G E )   { 
                         u t i l M o v e . r u n ( c r e e p ,   t a r g e t ,   ' # f f 0 0 0 0 ' ,   '�=ޜ ' ) ; 
                 }   e l s e   i f   ( r e s u l t   = =   E R R _ T I R E D )   { 
                         c r e e p . s a y ( "�=�4�=ޜ " ) ; 
                 }   e l s e   { 
                         c r e e p . s a y ( r e s u l t ) 
                 } 
                 r e t u r n   t r u e ; 
 	 } , 
 	 
 	 f i n d L e a s t U t i l i z e d S o u r c e :   f u n c t i o n ( c r e e p )   { 
 	         v a r   s e l f   =   t h i s ; 
 	         r e t u r n   _ . f i r s t ( _ . s o r t B y ( _ . f i l t e r ( c r e e p . r o o m . f i n d ( F I N D _ S O U R C E S ) ,   f u n c t i o n ( s o u r c e ) { 
 	                 r e t u r n   s o u r c e . e n e r g y   >   0   | |   s o u r c e . t i c k s T o R e g e n e r a t i o n   <   t h i s . A N T I C I P A T E _ S O U R C E _ R E G E N E R A T I O N _ D U R A T I O N ; 
 	         } ) ,   
 	         f u n c t i o n ( s o u r c e )   { 
 	                 v a r   n S p o t s   =   _ . s i z e ( u t i l P o s i t i o n . g e t S o u r c e M i n i n g S p o t s ( s o u r c e ) ) ; 
 	                 
 	                 v a r   n C r e e p s   =   _ . s i z e ( _ . f i l t e r ( G a m e . c r e e p s ,   f u n c t i o n ( g C r e e p ) { 
 	                         r e t u r n   g C r e e p . m e m o r y . t a s k   = =   s e l f . T a s k . h a r v e s t   & &   g C r e e p . m e m o r y . h a r v e s t T a r g e t I d   = =   s o u r c e . i d ; 
 	                 } ) )   +   _ . s i z e ( u t i l P o s i t i o n . g e t S o u r c e M i n e r s ( s o u r c e ) ) ; 
 	                 
 	                 r e t u r n   n C r e e p s   /   ( n S p o t s   +   1 ) ; 
 	         } ) ) ; 
 	 } 
 } ;