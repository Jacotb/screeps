 m o d u l e . e x p o r t s   =   { 
         r u n :   f u n c t i o n ( c r e e p ,   t a r g e t ,   s t y l e ,   i c o n ) { 
                 v a r   m o v e R e s u l t   =   c r e e p . m o v e T o ( t a r g e t ,   { v i s u a l i z e P a t h S t y l e :   { s t r o k e :   s t y l e } } ) ; 
                 i f   ( m o v e R e s u l t   = =   O K ) { 
                         c r e e p . s a y ( "�<��  "   +   i c o n ) ; 
                         r e t u r n   t r u e ; 
                 }   e l s e   i f   ( m o v e R e s u l t   = =   E R R _ T I R E D )   { 
                         c r e e p . s a y ( "�=�+ "   +   i c o n ) ; 
                         r e t u r n   t r u e ; 
                 }   e l s e   i f   ( m o v e R e s u l t   = =   E R R _ N O _ P A T H )   { 
                         c r e e p . s a y ( "�=ާ "   +   i c o n ) ; 
                         r e t u r n   f a l s e ; 
                 }   e l s e   i f   ( m o v e R e s u l t   = =   E R R _ I N V A L I D _ T A R G E T )   { 
                         c o n s o l e . l o g ( " I n v a l i d   m o v e   t a r g e t : " ,   t a r g e t ) ; 
                         r e t u r n   f a l s e ; 
                 }   e l s e   { 
                         c r e e p . s a y ( m o v e R e s u l t   +   i c o n ) ; 
                         r e t u r n   t r u e ; 
                 } 
         } 
 } ;