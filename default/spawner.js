 v a r   u t i l P o s i t i o n   =   r e q u i r e ( ' u t i l . p o s i t i o n ' ) ; 
 
 m o d u l e . e x p o r t s   =   { 
         l e v e l s :   [ 
                 { 
                         w o r k e r C o u n t :   1 2 , 
                         s o l d i e r C o u n t :   5 , 
                         a r c h e r C o u n t :   2 , 
                         w o r k e r :   [ W O R K ,   C A R R Y ,   M O V E ] , 
                         s o l d i e r :   [ A T T A C K ,   M O V E ] , 
                         a r c h e r :   [ R A N G E D _ A T T A C K ,   M O V E ] , 
                         m i n e r :   [ W O R K ,   W O R K ,   M O V E ] 
                 } , 
                 { 
                         w o r k e r C o u n t :   1 0 , 
                         s o l d i e r C o u n t :   3 , 
                         a r c h e r C o u n t :   3 , 
                         w o r k e r :   [ W O R K ,   W O R K ,   W O R K ,   C A R R Y ,   C A R R Y ,   M O V E ,   M O V E ,   M O V E ] , 
                         s o l d i e r :   [ A T T A C K ,   A T T A C K ,   A T T A C K ,   A T T A C K ,   M O V E ,   M O V E ,   M O V E ,   M O V E ] , 
                         a r c h e r :   [ R A N G E D _ A T T A C K ,   R A N G E D _ A T T A C K ,   M O V E ,   M O V E ,   M O V E ,   M O V E ,   M O V E ] , 
                         m i n e r :   [ W O R K ,   W O R K ,   W O R K ,   W O R K ,   W O R K ,   M O V E ] 
                 } , 
                 { 
                         w o r k e r C o u n t :   8 , 
                         s o l d i e r C o u n t :   7 , 
                         a r c h e r C o u n t :   7 , 
                         w o r k e r :   [ W O R K ,   W O R K ,   W O R K ,   W O R K ,   M O V E ,   M O V E ,   M O V E ,   M O V E ,   C A R R Y ,   C A R R Y ,   C A R R Y ,   C A R R Y ] , 
                         s o l d i e r :   [ A T T A C K ,   A T T A C K ,   A T T A C K ,   A T T A C K ,   A T T A C K ,   A T T A C K ,   M O V E ,   M O V E ,   M O V E ,   M O V E ,   M O V E ,   M O V E ] , 
                         a r c h e r :   [ R A N G E D _ A T T A C K ,   R A N G E D _ A T T A C K ,   R A N G E D _ A T T A C K ,   R A N G E D _ A T T A C K ,   R A N G E D _ A T T A C K ,   R A N G E D _ A T T A C K ,   R A N G E D _ A T T A C K ,   M O V E ,   M O V E ,   M O V E ,   M O V E ,   M O V E ] , 
                         m i n e r :   [ W O R K ,   W O R K ,   W O R K ,   W O R K ,   W O R K ,   W O R K ,   W O R K ,   M O V E ,   M O V E ] 
                 } 
         ] , 
         
         t i c k :   f u n c t i o n ( s p a w n )   { 
                 l e v e l   =   t h i s . g e t L e v e l ( s p a w n ) 
                 v a r   w o r k e r s   =   _ . f i l t e r ( G a m e . c r e e p s ,   ( c r e e p )   = >   c r e e p . m e m o r y . r o l e   = =   ' w o r k e r ' ) ; 
                 v a r   s o l d i e r s   =   _ . f i l t e r ( G a m e . c r e e p s ,   ( c r e e p )   = >   c r e e p . m e m o r y . r o l e   = =   ' s o l d i e r ' ) ; 
                 v a r   a r c h e r s   =   _ . f i l t e r ( G a m e . c r e e p s ,   ( c r e e p )   = >   c r e e p . m e m o r y . r o l e   = =   ' a r c h e r ' ) ; 
                 
                 / * v a r   e x t e n s i o n s   =   G a m e . s p a w n s . S p a w n 1 . r o o m . f i n d ( F I N D _ M Y _ S T R U C T U R E S ,   { 
                         f i l t e r :   {   s t r u c t u r e T y p e :   S T R U C T U R E _ E X T E N S I O N   } 
                 } ) ; 
                 v a r   e x t e n s i o n C o n s t r u c t i o n S i t e s   =   G a m e . s p a w n s . S p a w n 1 . r o o m . f i n d ( F I N D _ C O N S T R U C T I O N _ S I T E S ,   { 
                         f i l t e r :   {   s t r u c t u r e T y p e :   S T R U C T U R E _ E X T E N S I O N   } 
                 } ) ; 
                 v a r   n u m E x t e n s i o n s   =   e x t e n s i o n s . l e n g t h   +   e x t e n s i o n C o n s t r u c t i o n S i t e s . l e n g t h * / 
                 
                 i f ( w o r k e r s . l e n g t h   <   l e v e l . w o r k e r C o u n t )   { 
                         s p a w n . s p a w n C r e e p ( l e v e l . w o r k e r ,   s p a w n . n a m e   +   " - "   +   G a m e . t i m e ,   { m e m o r y :   { r o l e :   ' w o r k e r ' } } ) 
                 }   e l s e   i f ( u t i l P o s i t i o n . g e t F r e e M i n i n g C o n t a i n e r ( s p a w n . r o o m )   ! = =   u n d e f i n e d )   { 
                         s p a w n . s p a w n C r e e p ( l e v e l . m i n e r ,   s p a w n . n a m e   +   " - "   +   G a m e . t i m e ,   { m e m o r y :   { r o l e :   ' m i n e r ' } } ) ; 
                 }   e l s e   i f ( s o l d i e r s . l e n g t h   <   l e v e l . s o l d i e r C o u n t )   { 
                         s p a w n . s p a w n C r e e p ( l e v e l . s o l d i e r ,   s p a w n . n a m e   +   " - "   +   G a m e . t i m e ,   { m e m o r y :   { r o l e :   ' s o l d i e r ' ,   t a r g e t :   s p a w n . r o o m . n a m e } } ) 
                 }   e l s e   i f ( a r c h e r s . l e n g t h   <   l e v e l . a r c h e r C o u n t )   { 
                         s p a w n . s p a w n C r e e p ( l e v e l . a r c h e r ,   s p a w n . n a m e   +   " - "   +   G a m e . t i m e ,   { m e m o r y :   { r o l e :   ' a r c h e r ' ,   t a r g e t :   s p a w n . r o o m . n a m e } } ) 
                 } 
         } , 
         
         g e t L e v e l :   f u n c t i o n ( s p a w n ) { 
                 m a x   =   s p a w n . r o o m . e n e r g y C a p a c i t y A v a i l a b l e ; 
                 i f   ( m a x   <   ( 3 0 0   +   5   *   5 0 ) )   { 
                         r e t u r n   t h i s . l e v e l s [ 0 ] 
                 }   e l s e   i f   ( m a x   <   ( 3 0 0   +   1 0 * 5 0 ) )   { 
                         r e t u r n   t h i s . l e v e l s [ 1 ] 
                 }   e l s e   i f   ( m a x   <   ( 3 0 0   +   2 0 * 5 0 ) )   { 
                         r e t u r n   t h i s . l e v e l s [ 2 ] 
                 }   e l s e   { 
                         c o n s o l e . l o g ( " U p d a t e   d e s i g n s ! " ) 
                         r e t u r n   t h i s . l e v e l s [ 2 ] 
                 } 
         } 
 } ;